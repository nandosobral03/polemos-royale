import DayVisualization from "@/app/_components/game/day-visualization";
import PageHeading from "@/app/_components/utils/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import Link from "next/link";

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
  const game = await api.games.getGame({
    gameId: parseInt(params.id),
  });

  if (!dayInfo) {
    if (prevDay) {
      const winner = prevDay.playerStatuses.find((ps) => ps.health > 0);
      const player = game?.players.find((p) => p.id === winner?.playerId);
      return (
        <>
          <PageHeading title="The games are over" />
          <Card className="w-full p-4">
            <CardContent className="flex flex-col items-start gap-3 p-3">
              {winner && player ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <img
                    src={player.image}
                    className="h-48 w-48 rounded-md border border-yellow-500"
                  />
                  <p className="text-lg font-bold">{player.name} won</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-bold">Everyone died</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold">Not found</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-start justify-center gap-4 overflow-auto">
      <h1 className="mb-4 text-3xl font-bold">Day {dayInfo.day}</h1>
      <DayVisualization dayInfo={dayInfo} prevDay={prevDay} game={game} />
      <div className="flex w-full justify-end gap-4 ">
        {parseInt(params.day) > 0 && (
          <Link href={`/play/${params.id}/${parseInt(params.day) - 1}`}>
            <Button>Previous day</Button>
          </Link>
        )}
        <Link href={`/play/${params.id}/${parseInt(params.day) + 1}`}>
          <Button>Next day</Button>
        </Link>
      </div>
    </div>
  );
}
