import DayVisualization from "@/app/_components/game/day-visualization";
import PlayersAliveChart from "@/app/_components/game/players-alive-chart";
import PageHeading from "@/app/_components/utils/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TitledCard from "@/components/ui/titled-card";
import { api } from "@/trpc/server";
import { type Player } from "@prisma/client";
import Image from "next/image";
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

  if (!game) return <div>Not found</div>;

  if (!dayInfo) {
    const gameStats = await api.games.getGameStats({
      gameId: parseInt(params.id),
    });
    if (prevDay) {
      const winner = prevDay.playerStatuses.find((ps) => ps.health > 0);
      const player = game?.players.find((p) => p.id === winner?.playerId);
      return (
        <>
          <PageHeading title="The games are over" />
          <Card className="w-full p-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="grow">Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 p-3 md:flex-row">
              {winner && player ? (
                <Link href={`/play/${game.id}/player/${player.id}`}>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Image
                      height={128}
                      width={128}
                      src={player.image}
                      className="h-48 w-48 rounded-md border border-yellow-500"
                      alt={"Player image"}
                    />
                    <p className="text-lg font-bold">{player.name} won</p>
                  </div>
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-bold">Everyone died</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full p-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="grow">Game Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 p-3 ">
              <PlayersAliveChart
                numberOfPlayers={gameStats?.numberOfPlayersAliveByDay ?? []}
                initialCount={game?.players.length ?? 0}
              />
              <div className="flex w-full justify-end gap-4 ">
                {gameStats && (
                  <>
                    <TitledCard
                      title="Most Damage Done"
                      className="h-[30vh] items-start justify-start gap-4"
                    >
                      <Separator />

                      {gameStats.damageByPlayer
                        .slice(0, 5)
                        .map((player, idx) => (
                          <Link
                            href={`/play/${game.id}/player/${player.id}`}
                            key={player.name}
                          >
                            <LeaderBoardEntry
                              player={player}
                              score={player.damage}
                              idx={idx}
                            />
                          </Link>
                        ))}
                    </TitledCard>
                    <TitledCard
                      title="Most Kills"
                      className="h-[30vh] items-start justify-start gap-4"
                    >
                      <Separator />

                      {gameStats.killsByPlayer
                        .slice(0, 5)
                        .map((player, idx) => (
                          <Link
                            href={`/play/${game.id}/player/${player.id}`}
                            key={player.name}
                          >
                            <LeaderBoardEntry
                              player={player}
                              score={player.kills}
                              idx={idx}
                            />
                          </Link>
                        ))}
                    </TitledCard>
                    <TitledCard
                      title="Most Traveled"
                      className="h-[30vh] items-start justify-start gap-4"
                    >
                      <Separator />
                      {gameStats.traveledByPlayer
                        .slice(0, 5)
                        .map((player, idx) => (
                          <Link
                            href={`/play/${game.id}/player/${player.id}`}
                            key={player.name}
                          >
                            <LeaderBoardEntry
                              player={player}
                              score={player.traveled}
                              idx={idx}
                            />
                          </Link>
                        ))}
                    </TitledCard>
                  </>
                )}
              </div>
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

const LeaderBoardEntry = ({
  player,
  score,
  idx,
}: {
  player: Player;
  score: number;
  idx: number;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm">{idx + 1} - </div>
      <Image
        height={128}
        width={128}
        src={player.image}
        className="h-8 w-auto object-cover"
        alt={"Player image"}
      />
      <div className="text-sm font-bold">{player.name}:</div>
      <div className="text-sm">{score}</div>
    </div>
  );
};
