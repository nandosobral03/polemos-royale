"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExclamationTriangleIcon, Pencil2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { type GameEvent } from "@prisma/client";

export default function UpdateEventButton({
  initialValues,
}: {
  initialValues: GameEvent;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [event, setEvent] = useState<{
    description: string;
    numberOfAttackers: number;
    numberOfDefenders: number;
    hpChangeAttackers: string;
    hpChangeDefenders: string;
  }>({
    description: initialValues.description,
    numberOfAttackers: initialValues.numberOfAttackers,
    numberOfDefenders: initialValues.numberOfDefenders,
    hpChangeAttackers: initialValues.hpChangeAttackers.toString(),
    hpChangeDefenders: initialValues.hpChangeDefenders.toString(),
  });

  const handleOpenClose = (bool: boolean) => {
    if (!bool)
      setEvent({
        description: initialValues.description,
        numberOfAttackers: initialValues.numberOfAttackers,
        numberOfDefenders: initialValues.numberOfDefenders,
        hpChangeAttackers: initialValues.hpChangeAttackers.toString(),
        hpChangeDefenders: initialValues.hpChangeDefenders.toString(),
      });
    setOpen(bool);
  };

  const updateEventMutation = api.events.update.useMutation();
  const utils = api.useUtils();
  const handleUpdateEvent = async () => {
    await updateEventMutation.mutateAsync({
      description: event.description,
      numberOfAttackers: event.numberOfAttackers,
      numberOfDefenders: event.numberOfDefenders,
      hpChangeAttackers: parseInt(event.hpChangeAttackers.toString()),
      hpChangeDefenders: parseInt(event.hpChangeDefenders.toString()),
      id: initialValues.id,
    });
    toast({
      title: "Event updated",
      description: "The event has been updated",
    });
    await utils.games.invalidate();
    router.refresh();
    handleOpenClose(false);
  };

  const generateExampleEventDescription = () => {
    let initialDescription = event.description;
    for (let i = 0; i < event.numberOfAttackers; i++) {
      initialDescription = initialDescription.replaceAll(
        `a${i + 1}`,
        `<span class="text-red-500">Attacker #${i + 1}</span>`,
      );
    }
    for (let i = 0; i < event.numberOfDefenders; i++) {
      initialDescription = initialDescription.replaceAll(
        `d${i + 1}`,
        `<span class="text-primary">Defender #${i + 1}</span>`,
      );
    }
    return (
      <span dangerouslySetInnerHTML={{ __html: initialDescription }}></span>
    );
  };

  const calculatedPlayers = () => {
    const attackers = event.description.matchAll(/a\d+/g);
    const defenders = event.description.matchAll(/d\d+/g);
    const uniqueAttackers = [...new Set(Array.from(attackers))];
    const uniqueDefenders = [...new Set(Array.from(defenders))];
    return {
      attackers: uniqueAttackers.length,
      defenders: uniqueDefenders.length,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
        <Pencil2Icon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Update a new event</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Description</label>
            <Textarea
              placeholder="Type your message here."
              value={event.description}
              onChange={(e) =>
                setEvent((ev) => ({
                  ...ev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex gap-4">
            <div className="flex grow flex-col gap-1">
              <label htmlFor="numberOfAttackers">Number of attackers</label>
              <Input
                id="numberOfAttackers"
                placeholder="Type your message here."
                autoComplete="off"
                value={event.numberOfAttackers}
                onChange={(e) =>
                  setEvent((ev) => ({
                    ...ev,
                    numberOfAttackers: parseInt(e.target.value ?? "0"),
                  }))
                }
              />
            </div>
            <div className="flex grow flex-col gap-1">
              <label htmlFor="numberOfDefenders">Number of defenders</label>
              <Input
                id="numberOfDefenders"
                placeholder="Type your message here."
                autoComplete="off"
                value={event.numberOfDefenders}
                onChange={(e) =>
                  setEvent((ev) => ({
                    ...ev,
                    numberOfDefenders: parseInt(e.target.value ?? "0"),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex grow flex-col gap-1">
              Attackers HP change
              <Input
                id="numberOfAttackers"
                placeholder="Type your message here."
                autoComplete="off"
                value={event.hpChangeAttackers}
                onChange={(e) =>
                  setEvent((ev) => ({
                    ...ev,
                    hpChangeAttackers: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex grow flex-col gap-1">
              Defenders HP change
              <Input
                id="numberOfAttackers"
                placeholder="Type your message here."
                autoComplete="off"
                value={event.hpChangeDefenders}
                type="number"
                onChange={(e) =>
                  setEvent({ ...event, hpChangeDefenders: e.target.value })
                }
              />
            </div>
          </div>
          <Separator />
          {generateExampleEventDescription()}
          <Separator />
          <div className="flex flex-col gap-2">
            {parseInt(event.hpChangeAttackers) != 0 &&
              event.numberOfAttackers > 0 && (
                <span>
                  Attackers HP change:{" "}
                  {parseInt(event.hpChangeAttackers) > 0 ? (
                    <span className="text-primary">
                      +{event.hpChangeAttackers}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {event.hpChangeAttackers}
                    </span>
                  )}
                </span>
              )}
            {parseInt(event.hpChangeDefenders) != 0 &&
              event.numberOfDefenders > 0 && (
                <span>
                  Defenders HP change:{" "}
                  {parseInt(event.hpChangeDefenders) > 0 ? (
                    <span className="text-primary">
                      +{event.hpChangeDefenders}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {event.hpChangeDefenders}
                    </span>
                  )}
                </span>
              )}
          </div>
          {(calculatedPlayers().attackers !== event.numberOfAttackers ||
            calculatedPlayers().defenders !== event.numberOfDefenders) && (
            <>
              <Separator />

              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>
                  Player count mismatch.
                  <br />
                  {calculatedPlayers().attackers !==
                    event.numberOfAttackers && (
                    <>
                      Calculated {calculatedPlayers().attackers} attackers, but
                      got {event.numberOfAttackers}.
                      <br />
                    </>
                  )}
                  {calculatedPlayers().defenders !==
                    event.numberOfDefenders && (
                    <>
                      Calculated {calculatedPlayers().defenders} defenders, but
                      got {event.numberOfDefenders}.
                      <br />
                    </>
                  )}
                </span>
              </div>
            </>
          )}
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
            onClick={() => handleUpdateEvent()}
            disabled={
              updateEventMutation.isPending ||
              calculatedPlayers().attackers !== event.numberOfAttackers ||
              calculatedPlayers().defenders !== event.numberOfDefenders
            }
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
