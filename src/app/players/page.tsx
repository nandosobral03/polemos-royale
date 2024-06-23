import PageHeading from "../_components/utils/page-heading";
import PlayerCard from "../_components/player-card";
import { api } from "@/trpc/server";

export default async function Players() {
  const players = await api.players.getAll();
  return (
    <>
      <PageHeading
        title="Players"
        subtitle="Players are the characters that take part in the battle royale, each one of them belongs to a team, but don't confuse this for an alliance, each players is out for himself, there is no loyalty or friendship between players, they are just there to fight and win for their own."
      />
      <div className="flex flex-wrap justify-center gap-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </>
  );
}
