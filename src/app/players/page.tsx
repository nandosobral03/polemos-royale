import PlayerCard from "../_components/player-card";
import { api } from "@/trpc/server"

export default async function Players() {
    const players = await api.players.getAll();
    return (
        <div className="flex min-h-screen flex-col gap-12 px-4 py-8">
            <div className="flex w-full justify-between">
                <h1 className="text-xl font-medium tracking-tight sm:text-[2rem] grow">
                    Players
                </h1>
                {/* <CreateTeamButton players={freeAgents} sponsors={sponsors} /> */}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                {players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    )
}
