"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Player, Sponsor } from "@prisma/client"

import { Button } from "@/components/ui/button"
import Dropzone from 'react-dropzone'
import { UploadIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";
import {
    usePapaParse,
} from 'react-papaparse';
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function UploadTeamsButton() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const { readString } = usePapaParse();
    const router = useRouter();

    const handleUploadCSV = async () => {

    }

    const handleOpenClose = (bool: boolean) => {
        if (bool) setOpen(true);
        else {
            setOpen(false);
            setFile(null);
        }
    }

    const massCreateMutation = api.teams.massUploadTeams.useMutation();
    const handleCreateTeam = async () => {
        if (!file) return;
        const csv = await file.text();
        readString(csv, {
            worker: true,
            complete: (results: { data: string[][] }) => {
                const data = results.data.slice(1);
                const acc = data.reduce((acc: {
                    teams: {
                        name: string,
                        sponsorName: string | undefined
                    }[],
                    players: {
                        name: string,
                        teamName: string
                        image: string
                    }[],
                    sponsors: { name: string }[]
                }, row: string[]) => {
                    const [number, teamNumber, teamName, name, image, sponsorName] = row;

                    if (!teamName || !name || !image) {
                        return acc;
                    }

                    acc.players.push({ name, teamName, image });
                    if (sponsorName) {
                        if (!acc.teams.find(t => t.name === teamName)) {
                            acc.teams.push({ name: teamName, sponsorName });
                        }
                        if (!acc.sponsors.find(s => s.name === sponsorName)) {
                            acc.sponsors.push({ name: sponsorName });
                        }
                    } else {
                        if (!acc.teams.find(t => t.name === teamName)) {
                            acc.teams.push({ name: teamName, sponsorName: undefined });
                        }
                    }

                    return acc;
                }, { teams: [], players: [], sponsors: [] });

                massCreateMutation.mutate(acc, {
                    onSuccess: () => {
                        setOpen(false);
                        setFile(null);
                        router.refresh();
                        toast({
                            title: "Teams created",
                            description: "The teams have been created",
                        });
                    },
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenClose}>
            <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
                <UploadIcon />
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Create a new team</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-2">
                    <Dropzone onDrop={acceptedFiles => setFile(acceptedFiles[0] ?? null)}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="flex flex-col gap-2 border border-gray-200 rounded-md p-4 border-dashed cursor-pointer text-center h-full">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Upload the teams CSV file</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </DialogDescription>
                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => handleOpenClose(false)}>
                        Cancel
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleCreateTeam()} disabled={!file}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}