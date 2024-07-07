import GameEventCard from "@/app/_components/game/game-event-card";
import PlayerHealthChart from "@/app/_components/game/player-health-chart";
import PlayerHexGridMap from "@/app/_components/game/player-hexgrid-map";
import PageHeading from "@/app/_components/utils/page-heading";
import TitledCard from "@/components/ui/titled-card";
import { getPlayerChanges } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function PlayerGameJourneyPage({
  params,
}: {
  params: {
    id: string;
    player: string;
  };
}) {
  const playerInfo = await api.games.getPlayerJorneyInGame({
    gameId: parseInt(params.id),
    playerId: parseInt(params.player),
  });

  const game = await api.games.getGame({
    gameId: parseInt(params.id),
  });

  if (!playerInfo || !game) {
    return <div>Not found</div>;
  }

  const movements = playerInfo.journey
    .map(
      (day) =>
        day.playerStatuses.find((ps) => ps.playerId === playerInfo.player.id)
          ?.tileId,
    )
    .filter((t) => t !== undefined)
    .reduce((acc, curr) => {
      // if last element is the same as curr don't add it
      if (acc[acc.length - 1] === curr) return acc;
      return [...acc, curr];
    }, [] as number[]);

  const health = playerInfo.journey.map(
    (day) =>
      day.playerStatuses.find((ps) => ps.playerId === playerInfo.player.id)
        ?.health ?? 0,
  );

  return (
    <>
      <PageHeading title={`${playerInfo.player.name}'s journey`} />
      <PlayerHealthChart health={health} />
      <PlayerHexGridMap
        gridElements={game.tiles}
        eventLogs={[]}
        movements={movements}
      />
      <TitledCard title="Event log" className="h-fit gap-4">
        {playerInfo.journey.map((day, i) => {
          const playerChanges = getPlayerChanges(
            day,
            playerInfo.journey[i - 1] ?? null,
          );
          return (
            <>
              {day.eventLogs.map((el) => (
                <GameEventCard
                  event={el}
                  playerChanges={playerChanges}
                  key={el.id}
                  gameId={game.id}
                />
              ))}
            </>
          );
        })}
      </TitledCard>
    </>
  );
}
