import CreateTeamButton from "../_components/create-team-button";
import PageHeading from "../_components/page-heading";
import TeamCard from "../_components/team-card";
import UploadTeamsButton from "../_components/upload-teams";
import { api } from "@/trpc/server";

export default async function Teams() {
  const teams = await api.teams.getAll();
  const sponsors = await api.sponsors.getAll();
  const freeAgents = await api.players.getAllPlayersWithNoTeam();
  return (
    <>
      <PageHeading
        title="Teams"
        subtitle="Teams are composed of players joined together by some common characteristic which guides them to work together and fight for the same goal."
      >
        <CreateTeamButton players={freeAgents} sponsors={sponsors} />
        <UploadTeamsButton />
      </PageHeading>

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
    </>
  );
}
