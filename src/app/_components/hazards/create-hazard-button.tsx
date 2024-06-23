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

export default function CreateHazardButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [hazardName, setHazardName] = useState<string>("");

  const handleOpenClose = (bool: boolean) => {
    if (bool) setOpen(true);
    else {
      setOpen(false);
      setHazardName("");
    }
  };

  const createHazardMutation = api.hazards.create.useMutation();
  const handleCreateHazard = async () => {
    await createHazardMutation.mutateAsync({
      name: hazardName,
    });
    toast({
      title: "Hazard created",
      description: "The hazard has been created",
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
          <DialogTitle> Create a new hazard</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              placeholder="Hazard name"
              autoComplete="off"
              value={hazardName}
              onChange={(e) => setHazardName(e.target.value)}
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
            onClick={() => handleCreateHazard()}
            disabled={!hazardName || createHazardMutation.isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
