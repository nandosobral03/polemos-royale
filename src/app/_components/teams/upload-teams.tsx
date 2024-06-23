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

export default function UploadTeamsButton() {
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

  const massCreateMutation = api.teams.massUploadTeams.useMutation();
  const handleCreateTeam = async () => {
    if (!file) return;
    const csv = await file.text();
    readString(csv, {
      worker: true,
      complete: (results: { data: string[][] }) => {
        const data = results.data.slice(1);
        const acc = data.reduce(
          (
            acc: {
              teams: {
                name: string;
                sponsorName: string | undefined;
              }[];
              players: {
                name: string;
                teamName: string;
                image: string;
              }[];
              sponsors: { name: string }[];
            },
            row: string[],
          ) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_number, _teamNumber, teamName, name, image, sponsorName] =
              row;

            if (!teamName || !name || !image) {
              return acc;
            }

            acc.players.push({ name, teamName, image });
            if (sponsorName) {
              if (!acc.teams.find((t) => t.name === teamName)) {
                acc.teams.push({ name: teamName, sponsorName });
              }
              if (!acc.sponsors.find((s) => s.name === sponsorName)) {
                acc.sponsors.push({ name: sponsorName });
              }
            } else {
              if (!acc.teams.find((t) => t.name === teamName)) {
                acc.teams.push({ name: teamName, sponsorName: undefined });
              }
            }

            return acc;
          },
          { teams: [], players: [], sponsors: [] },
        );

        massCreateMutation.mutate(acc, {
          onSuccess: () => {
            setOpen(false);
            setFile(null);
            window.location.reload();
            toast({
              title: "Teams created",
              description: "The teams have been created",
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
          <DialogTitle> Upload Teams CSV</DialogTitle>
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
