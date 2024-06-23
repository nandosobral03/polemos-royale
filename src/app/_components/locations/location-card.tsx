"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircledIcon,
  Cross2Icon,
  ListBulletIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { type RouterOutputs, api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import LocationEventButtons from "./location-events-button";
import { GameEvent } from "@prisma/client";
import ImageInput from "../utils/image-input";

export default function LocationCard({
  location,
  events,
}: {
  location: RouterOutputs["locations"]["getAll"][number];
  events: GameEvent[];
}) {
  const [locationName, setLocationName] = useState(location.name);
  const [locationImage, setLocationImage] = useState(location.image);
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const updateLocationMutation = api.locations.update.useMutation();
  const handleUpdate = async () => {
    await updateLocationMutation.mutateAsync({
      id: location.id,
      name: locationName,
      image: locationImage,
    });
    router.refresh();
    toast({
      title: "Location updated",
      description: "The location has been updated",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocationName(location.name);
    setLocationImage(location.image);
    setIsEditing(false);
  };

  const deleteLocationMutation = api.locations.delete.useMutation();
  const handleDelete = async () => {
    await deleteLocationMutation.mutateAsync({ id: location.id });
    router.refresh();
  };

  if (isEditing) {
    return (
      <Card key={location.id} className="w-full grow  lg:w-1/3">
        <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
          <ImageInput
            src={locationImage}
            alt={locationName}
            onChange={(e) => setLocationImage(e)}
          >
            <img
              src={locationImage}
              alt={locationName}
              className="aspect-square h-24 w-auto rounded-md object-cover"
              style={{
                background: "#fff",
                clipPath:
                  "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                objectFit: "cover",
              }}
            />
          </ImageInput>
          <div className="flex grow flex-col">
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
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
    <Card key={location.id} className="w-full grow lg:w-1/3">
      <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
        <img
          src={locationImage}
          alt={locationName}
          className="aspect-square h-24 w-auto rounded-md object-cover"
          style={{
            background: "#fff",
            clipPath:
              "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
            objectFit: "cover",
          }}
        />
        <div className="flex grow flex-col">
          <span className="text-lg font-medium">{locationName}</span>
          <span className="text-sm text-gray-500">
            {location.events.length} events
          </span>
        </div>
        <LocationEventButtons events={events} location={location} />
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
