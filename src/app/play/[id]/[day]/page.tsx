import GameEventCard from "@/app/_components/game/game-event-card";
import { api } from "@/trpc/server";

export default async function PlayPage({
  params,
}: {
  params: {
    id: string;
    day: string;
  };
}) {
  const dayInfo = await api.games.getGameDayInfo({
    gameId: parseInt(params.id),
    day: parseInt(params.day),
  });
  const prevDay = await api.games.getGameDayInfo({
    gameId: parseInt(params.id),
    day: parseInt(params.day) - 1,
  });

  if (!dayInfo) return <div>Not found</div>;

  const playerChanges: Record<
    number,
    {
      health: {
        prev: number;
        current: number;
      };
      tileId: {
        prev: number;
        current: number;
      };
    }
  > = dayInfo.playerStatuses.reduce(
    (acc, ps) => {
      const prev = prevDay?.playerStatuses.find(
        (p) => p.playerId === ps.playerId,
      );
      acc[ps.playerId] = {
        health: {
          prev: prev?.health ?? 100,
          current: ps.health,
        },
        tileId: {
          prev: prev?.tileId ?? 0,
          current: ps.tileId,
        },
      };
      return acc;
    },
    {} as Record<
      number,
      {
        health: { prev: number; current: number };
        tileId: { prev: number; current: number };
      }
    >,
  );

  return (
    <div className="flex flex-col items-center justify-center overflow-auto">
      Day {dayInfo.day}
      <div className="flex flex-col gap-4">
        {dayInfo.eventLogs.map((el) => (
          <GameEventCard event={el} playerChanges={playerChanges} />
        ))}
      </div>
    </div>
  );
}
