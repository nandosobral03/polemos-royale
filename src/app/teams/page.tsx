import CreateTeamButton from "../_components/create-team-button";
import TeamCard from "../_components/team-card";
import UploadTeamsButton from "../_components/upload-teams";
import { api } from "@/trpc/server";

export default async function Teams() {
  const teams = await api.teams.getAll();
  const sponsors = await api.sponsors.getAll();
  const freeAgents = await api.players.getAllPlayersWithNoTeam();
  return (
    <div className="flex min-h-screen flex-col gap-12 px-4 py-8">
      <div className="flex w-full justify-between gap-2">
        <h1 className="grow text-xl font-medium tracking-tight sm:text-[2rem]">
          Teams
        </h1>
        <CreateTeamButton players={freeAgents} sponsors={sponsors} />
        <UploadTeamsButton />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            sponsors={sponsors}
            freeAgents={freeAgents}
          />
        ))}
      </div>
    </div>
  );
}
