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
import ImageInput from "./image-input";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function SponsorCard({
  sponsor,
}: {
  sponsor: RouterOutputs["sponsors"]["getAll"][number];
}) {
  const [sponsorName, setPlayerName] = useState(sponsor.name);
  const [sponsorImage, setPlayerImage] = useState(sponsor.image);
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const updatePlayerMutation = api.sponsors.update.useMutation();
  const handleUpdate = async () => {
    await updatePlayerMutation.mutateAsync({
      id: sponsor.id,
      name: sponsorName,
      image: sponsorImage,
    });
    router.refresh();
    toast({
      title: "Player updated",
      description: "The sponsor has been updated",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPlayerName(sponsor.name);
    setPlayerImage(sponsor.image);
    setIsEditing(false);
  };

  const deletePlayerMutation = api.sponsors.delete.useMutation();
  const handleDelete = async () => {
    await deletePlayerMutation.mutateAsync({ id: sponsor.id });
    router.refresh();
  };

  if (isEditing) {
    return (
      <Card key={sponsor.id} className="mr-auto w-full grow lg:w-1/3">
        <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
          <ImageInput
            src={sponsorImage}
            alt={sponsorName}
            onChange={(e) => setPlayerImage(e)}
          />
          <div className="flex grow flex-col">
            <Input
              value={sponsorName}
              onChange={(e) => setPlayerName(e.target.value)}
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
    <Card
      key={sponsor.id}
      className="mr-auto w-full grow lg:w-1/3 lg:max-w-[50%]"
    >
      <CardContent className="flex items-center justify-between gap-3 p-3 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sponsorImage}
          alt={sponsorName}
          className="aspect-square h-12 w-auto rounded-md object-cover"
        />
        <div className="flex grow flex-col">
          <span className="text-lg font-medium">{sponsorName}</span>
          <p className="text-sm text-gray-500">
            {!!sponsor.teams[0]
              ? sponsor.teams.length === 1
                ? "Sponsor of " + sponsor.teams[0].name
                : `Sponsoring ${sponsor.teams[0].name} and ${sponsor.teams.length - 1} other teams`
              : "No teams sponsored"}
          </p>
        </div>
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
