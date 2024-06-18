"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Dropzone from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";
import { usePapaParse } from "react-papaparse";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { type GameEvent } from "@prisma/client";

export default function UploadEventsButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const { readString } = usePapaParse();

  const handleOpenClose = (bool: boolean) => {
    if (bool) setOpen(true);
    else {
      setOpen(false);
      setFile(null);
    }
  };

  const massCreateMutation = api.events.massUploadEvents.useMutation();
  const handleCreateTeam = async () => {
    if (!file) return;
    const csv = await file.text();
    readString(csv, {
      worker: true,
      complete: (results: { data: string[][] }) => {
        const data = results.data.slice(1);
        const allEvents: Omit<GameEvent, "id">[] = data
          .map((row) => {
            const [numAttackers, numDefenders, dmgAV, dmgVA, description] = row;
            if (
              numAttackers === undefined ||
              numDefenders === undefined ||
              dmgAV === undefined ||
              dmgVA === undefined ||
              description === undefined
            )
              return null;
            let curr = 1;
            let descriptionString = description;
            for (let i = 0; i < parseInt(numAttackers); i++) {
              descriptionString = descriptionString.replaceAll(
                `p${curr}`,
                `a${i + 1}`,
              );
              curr++;
            }
            for (let i = 0; i < parseInt(numDefenders); i++) {
              descriptionString = descriptionString.replaceAll(
                `p${curr}`,
                `d${i + 1}`,
              );
              curr++;
            }

            return {
              numberOfAttackers: parseInt(numAttackers),
              numberOfDefenders: parseInt(numDefenders),
              hpChangeAttackers: -parseInt(dmgAV),
              hpChangeDefenders: -parseInt(dmgVA),
              description: descriptionString,
            };
          })
          .filter((e) => e !== null);

        massCreateMutation.mutate(allEvents, {
          onSuccess: () => {
            setOpen(false);
            setFile(null);
            window.location.reload();
            toast({
              title: "Events created",
              description: "The events have been created",
            });
          },
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
        <UploadIcon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Upload Events CSV</DialogTitle>
        </DialogHeader>
        <Dropzone onDrop={(acceptedFiles) => setFile(acceptedFiles[0] ?? null)}>
          {({ getRootProps, getInputProps }) => (
            <div className="flex h-full cursor-pointer flex-col gap-2 rounded-md border border-dashed border-gray-200 p-4 text-center">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">{file.name}</p>
                    <p className="text-sm">{file.size} bytes</p>
                  </div>
                ) : (
                  <p className="text-sm">
                    Drag and drop a CSV file here, or click to select a file
                  </p>
                )}
              </div>
            </div>
          )}
        </Dropzone>
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
            onClick={() => handleCreateTeam()}
            disabled={!file}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
