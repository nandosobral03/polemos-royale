"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ImageInput from "../utils/image-input";

export default function CreateLocationButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [locationName, setLocationName] = useState<string>("");
  const [locationImage, setLocationImage] = useState<string>("");

  const handleOpenClose = (bool: boolean) => {
    if (bool) setOpen(true);
    else {
      setOpen(false);
      setLocationName("");
      setLocationImage("");
    }
  };

  const createLocationMutation = api.locations.create.useMutation();
  const handleCreateLocation = async () => {
    await createLocationMutation.mutateAsync({
      name: locationName,
      image: locationImage,
    });
    toast({
      title: "Location created",
      description: "The location has been created",
    });
    router.refresh();
    handleOpenClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
        <PlusCircledIcon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Create a new location</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <ImageInput
              src={
                locationImage
                  ? locationImage
                  : "https://via.placeholder.com/150"
              }
              alt=""
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
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              placeholder="Location name"
              autoComplete="off"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
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
            onClick={() => handleCreateLocation()}
            disabled={
              !locationName ||
              !locationImage ||
              createLocationMutation.isPending
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
