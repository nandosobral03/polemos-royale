import DayVisualization from "@/app/_components/game/day-visualization";
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
  const game = await api.games.getGame({
    gameId: parseInt(params.id),
  });

  if (!dayInfo) return <div>Not found</div>;

  return (
    <div className="flex flex-col items-start justify-center gap-2 overflow-auto">
      <h1 className="mb-4 text-3xl font-bold">Day {dayInfo.day}</h1>
      <DayVisualization dayInfo={dayInfo} prevDay={prevDay} game={game} />
    </div>
  );
}
