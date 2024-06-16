"use client"

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircledIcon, Cross1Icon, Cross2Icon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { RouterOutputs, api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import ImageInput from "./image-input";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function PlayerCard({ player }: { player: RouterOutputs["players"]["getAll"][number] }) {
    const [playerName, setPlayerName] = useState(player.name);
    const [playerImage, setPlayerImage] = useState(player.image);
    const router = useRouter()
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(false);


    const updatePlayerMutation = api.players.update.useMutation()
    const handleUpdate = async () => {
        await updatePlayerMutation.mutateAsync({ id: player.id, name: playerName, image: playerImage })
        router.refresh()
        toast({
            title: "Player updated",
            description: "The player has been updated",
        })
        setIsEditing(false)
    }

    const handleCancel = () => {
        setPlayerName(player.name)
        setPlayerImage(player.image)
        setIsEditing(false)
    }

    const deletePlayerMutation = api.players.delete.useMutation()
    const handleDelete = async () => {
        await deletePlayerMutation.mutateAsync({ id: player.id })
        router.refresh()
    }


    if (isEditing) {
        return (
            <Card key={player.id} className="w-full lg:w-1/3 ">
                <CardContent className="flex gap-3 pt-3 p-3 items-center justify-between">
                    <ImageInput src={playerImage} alt={playerName} onChange={(e) => setPlayerImage(e)} />
                    <div className="flex flex-col grow">
                        <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full" />
                    </div>
                    <Button variant="default" size="sm" onClick={handleUpdate}>
                        <CheckCircledIcon />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleCancel}>
                        <Cross2Icon />
                    </Button>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card key={player.id} className="w-full lg:w-1/3 ">
            <CardContent className="flex gap-3 pt-3 p-3 items-center justify-between">
                <img src={playerImage} alt={playerName} className="h-12 w-auto aspect-square rounded-md object-cover" />
                <div className="flex flex-col grow">
                    <span className="text-lg font-medium">{playerName}</span>
                    <p className="text-sm text-gray-500">Member of {player.team ? player.team.name : "No team"}</p>
                </div>
                <Button variant="default" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil2Icon />
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <TrashIcon />
                </Button>
            </CardContent>
        </Card>
    )
}