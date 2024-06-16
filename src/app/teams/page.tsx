import { Button } from "@/components/ui/button";
import CreateTeamButton from "../_components/create-team-button";
import TeamCard from "../_components/team-card";
import { UploadIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/server"

export default async function Teams() {
    const teams = await api.teams.getAll();
    const sponsors = await api.sponsors.getAll();
    const freeAgents = await api.players.getAllPlayersWithNoTeam();
    return (
        <div className="flex min-h-screen flex-col gap-12 px-4 py-8">
            <div className="flex w-full justify-between">
                <h1 className="text-xl font-medium tracking-tight sm:text-[2rem] grow">
                    Teams
                </h1>
                <CreateTeamButton players={freeAgents} sponsors={sponsors} />
                <Button className="ml-2" variant="default" size="sm">
                    <UploadIcon />
                </Button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                {teams.map((team) => (
                    <TeamCard key={team.id} team={team} sponsors={sponsors} freeAgents={freeAgents} />
                ))}
            </div>
        </div>
    )
}
