"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircledIcon, Cross2Icon, Pencil2Icon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Player, Sponsor } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function TeamCard({ team, sponsors, freeAgents }: {
    team: RouterOutputs["teams"]["getAll"][0],
    sponsors: Sponsor[]
    freeAgents: Player[],
}) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [availablePlayers, setAvailablePlayers] = useState<Player[]>(freeAgents);
    const [teamName, setTeamName] = useState(team.name);
    const [sponsorId, setSponsorId] = useState(team.sponsorId?.toString() ?? "");
    const [players, setPlayers] = useState(team.players);
    const router = useRouter();

    const handleDeletePlayer = (id: number) => {
        const selected = players.find(p => p.id === id);
        if (!selected) return;
        setPlayers(p => p.filter(p => p.id !== id));
        setAvailablePlayers(p => [...p, selected]);
    }

    const handleAddPlayer = (id: number) => {
        const selected = availablePlayers.find(p => p.id === id);
        if (!selected) return;
        setPlayers(p => [...p, selected]);
        setAvailablePlayers(p => p.filter(p => p.id !== id));
    }

    const updateTeamMutation = api.teams.update.useMutation();
    const updatePlayersMutation = api.teams.updatePlayers.useMutation();
    const deleteTeamMutation = api.teams.delete.useMutation();


    const handleUpdate = async () => {
        setLoading(true);
        await updateTeamMutation.mutateAsync({ id: team.id, name: teamName, sponsorId: sponsorId ? parseInt(sponsorId) : undefined });
        await updatePlayersMutation.mutateAsync({ id: team.id, players: players.map(p => p.id) });
        setIsEditing(false);
        setLoading(false);
        toast({
            title: "Team updated",
            description: "The team has been updated",
        });
    }

    const handleDelete = async () => {
        setLoading(true);
        await deleteTeamMutation.mutateAsync({ id: team.id });
        setLoading(false);
        toast({
            title: "Team deleted",
            description: "The team has been deleted",
        });
        router.refresh();
    }


    const cancelEdit = () => {
        setIsEditing(false);
        setTeamName(team.name);
        setSponsorId(team.sponsorId?.toString() ?? "");
        setPlayers(team.players);
        setAvailablePlayers(freeAgents);
    }

    return (
        <>
            {isEditing ?
                (
                    <Card className="max-w-sm min-w-[24rem]">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center gap-2">
                                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                                <Button variant="default" size="sm" onClick={() => handleUpdate()} disabled={loading}>
                                    {loading ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={loading}>
                                    <Cross2Icon />
                                </Button>
                            </CardTitle >
                            <CardDescription>
                                <div className="flex items-center gap-2">
                                    Sponsored by <Select value={sponsorId} onValueChange={(value) => setSponsorId(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a sponsor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sponsors.map((sponsor) => (
                                                <SelectItem key={sponsor.id} value={sponsor.id.toString()}>{sponsor.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center gap-2">
                                    <Button variant="destructive" size="sm" onClick={() => handleDeletePlayer(player.id)}>
                                        <TrashIcon />
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <img src={player.image} className="h-8 w-auto aspect-square object-cover" alt="Player" />
                                        <div className="text-sm">{player.name}</div>
                                    </div>
                                </div>
                            ))}
                            {!!availablePlayers.length && (
                                <Select onValueChange={(value) => handleAddPlayer(parseInt(value))} value="0">
                                    <SelectTrigger className="w-[180px]">
                                        Add a player
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePlayers.map((player) => (
                                            <SelectItem key={player.id} value={player.id.toString()}>{player.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </CardContent>
                    </Card>
                )
                : (
                    <Card className="max-w-sm min-w-[24rem]">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center gap-2">
                                <span className="grow">
                                    {teamName}
                                </span >
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                    <Pencil2Icon />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleDelete}>
                                    <TrashIcon />
                                </Button>
                            </CardTitle >
                            {sponsorId ? <CardDescription>Sponsored by {sponsors.find(s => s.id.toString() === sponsorId)?.name}</CardDescription> : null}
                        </CardHeader >
                        <CardContent className="flex flex-col gap-2">
                            {players.map((player) => (
                                <div key={player.id}>
                                    <div className="flex items-center gap-2">
                                        <img src={player.image} className="h-8 w-auto aspect-square object-cover" alt="Player" />
                                        <div className="text-sm">{player.name}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card >
                )}
        </>
    )
}