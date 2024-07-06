"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircledIcon,
  Cross2Icon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { type RouterOutputs, api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import HazardEventButtons from "./hazard-events-button";
import { type GameEvent } from "@prisma/client";

export default function HazardCard({
  hazard,
  events,
}: {
  hazard: RouterOutputs["hazards"]["getAll"][number];
  events: GameEvent[];
}) {
  const [hazardName, setHazardName] = useState(hazard.name);
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const updateHazardMutation = api.hazards.update.useMutation();
  const handleUpdate = async () => {
    await updateHazardMutation.mutateAsync({
      id: hazard.id,
      name: hazardName,
    });
    router.refresh();
    toast({
      title: "Hazard updated",
      description: "The hazard has been updated",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHazardName(hazard.name);
    setIsEditing(false);
  };

  const deleteHazardMutation = api.hazards.delete.useMutation();
  const handleDelete = async () => {
    await deleteHazardMutation.mutateAsync({ id: hazard.id });
    router.refresh();
  };

  if (isEditing) {
    return (
      <Card key={hazard.id} className="w-full grow  lg:w-1/3">
        <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
          <div className="flex grow flex-col">
            <Input
              value={hazardName}
              onChange={(e) => setHazardName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="default" size="sm" onClick={handleUpdate}>
            <CheckCircledIcon />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleCancel}>
            <Cross2Icon />
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card key={hazard.id} className="w-full grow lg:w-1/3">
      <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
        <div className="flex grow flex-col">
          <span className="text-lg font-medium">{hazardName}</span>
          <span className="text-sm text-gray-500">
            {hazard.events.length} events
          </span>
        </div>
        <HazardEventButtons events={events} hazard={hazard} />
        <Button variant="default" size="sm" onClick={() => setIsEditing(true)}>
          <Pencil2Icon />
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <TrashIcon />
        </Button>
      </CardContent>
    </Card>
  );
}
