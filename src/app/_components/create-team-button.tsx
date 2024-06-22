"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Player, type Sponsor } from "@prisma/client";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateTeamButton({
  players,
  sponsors,
}: {
  players: Player[];
  sponsors: Sponsor[];
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const availablePlayers = players.filter((p) => !team.players.includes(p));
  const [team, setTeam] = useState<{
    name: string;
    sponsorId: number | null;
    players: Player[];
  }>({
    name: "",
    sponsorId: null,
    players: [],
  });

  const handleAddPlayer = (id: number) => {
    const selected = availablePlayers.find((p) => p.id === id);
    if (!selected) return;
    setTeam({ ...team, players: [...team.players, selected] });
  };

  const handleDeletePlayer = (id: number) => {
    const selected = team.players.find((p) => p.id === id);
    if (!selected) return;
    setTeam({ ...team, players: team.players.filter((p) => p.id !== id) });
  };

  const createTeamMutation = api.teams.create.useMutation();

  const handleCreateTeam = async () => {
    await createTeamMutation.mutateAsync({
      name: team.name,
      sponsorId: team.sponsorId ?? undefined,
      players: team.players.map((p) => p.id),
    });
    toast({
      title: "Team created",
      description: "The team has been created",
    });
    router.refresh();
    handleOpenClose(false);
  };

  const handleOpenClose = (bool: boolean) => {
    if (bool) setOpen(true);
    else {
      setOpen(false);
      setTeam({
        name: "",
        sponsorId: null,
        players: [],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <Button variant="default" size="sm" onClick={() => handleOpenClose(true)}>
        <PlusCircledIcon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Create a new team</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              placeholder="Team name"
              autoComplete="off"
              value={team.name}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="sponsor">Sponsor</label>
            <Select
              value={team.sponsorId?.toString()}
              onValueChange={(value) =>
                setTeam({ ...team, sponsorId: value ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a sponsor" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor) => (
                  <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="players">Players</label>
            <div className="flex flex-col gap-2">
              {team.players.map((player) => (
                <div key={player.id} className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    <TrashIcon />
                  </Button>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={player.image}
                      className="aspect-square h-8 w-auto object-cover"
                      alt="Player"
                    />
                    <div className="text-sm">{player.name}</div>
                  </div>
                </div>
              ))}
              {!!availablePlayers.length && (
                <Select
                  onValueChange={(value) => handleAddPlayer(parseInt(value))}
                  value="0"
                >
                  <SelectTrigger className="w-[180px]">
                    Add a player
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
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
            onClick={() => handleCreateTeam()}
            disabled={!team.name || createTeamMutation.isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
