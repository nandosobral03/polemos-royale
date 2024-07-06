"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type GameEvent } from "@prisma/client";
import { ListBulletIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { api, type RouterOutputs } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateExampleEventDescription } from "@/lib/utils";

export default function HazardEventButtons({
  events,
  hazard,
}: {
  events: GameEvent[];
  hazard: RouterOutputs["hazards"]["getAll"][number];
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [eventsInHazard, setEventsInHazard] = useState<GameEvent[]>(
    hazard.events,
  );
  const [remainingEvents, setRemainingEvents] = useState<GameEvent[]>(
    events.filter((e) => !eventsInHazard.includes(e)),
  );

  const handleOpenClose = (bool: boolean) => {
    if (bool) setOpen(true);
    else {
      setOpen(false);
      setEventsInHazard(hazard.events);
      setRemainingEvents(events.filter((e) => !eventsInHazard.includes(e)));
    }
  };

  const handleAddEvent = (eventId: number) => {
    const selected = events.find((e) => e.id === eventId);
    if (!selected) return;
    setEventsInHazard([...eventsInHazard, selected]);
    setRemainingEvents(events.filter((e) => e.id !== eventId));
  };

  const handleDeleteEvent = (eventId: number) => {
    const selected = eventsInHazard.find((e) => e.id === eventId);
    if (!selected) return;
    setEventsInHazard(eventsInHazard.filter((e) => e.id !== eventId));
    setRemainingEvents([...remainingEvents, selected]);
  };

  const setHazardEventsMutation = api.hazards.setHazardEvents.useMutation();
  const utils = api.useUtils();
  const handleSetEvents = async () => {
    await setHazardEventsMutation.mutateAsync({
      id: hazard.id,
      events: eventsInHazard.map((e) => e.id),
    });
    await utils.hazards.invalidate();
    await utils.events.invalidate();
    router.refresh();
    toast({
      title: "Hazard updated",
      description: "The hazard has been updated",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
        <ListBulletIcon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Update Hazard Events</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2">
              {eventsInHazard.map((event) => (
                <div
                  key={`${event.id}-hazard`}
                  className="flex items-center justify-between gap-2"
                >
                  {generateExampleEventDescription(event)}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            </div>
            {!!remainingEvents.length && (
              <Select
                onValueChange={(value) => handleAddEvent(parseInt(value))}
                value="0"
              >
                <SelectTrigger className="mt-4 w-full">
                  Add an event
                </SelectTrigger>
                <SelectContent>
                  {remainingEvents.map((event) => (
                    <SelectItem
                      key={`${event.id}-available`}
                      value={event.id.toString()}
                    >
                      {generateExampleEventDescription(event)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenClose(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleSetEvents()}
            disabled={
              !eventsInHazard.length || setHazardEventsMutation.isPending
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
