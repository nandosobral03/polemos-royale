import { Card, CardContent } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/react";
import { GameEventLog, Player } from "@prisma/client";

export default function GameEventCard({
  event,
  playerChanges,
}: {
  event: GameEventLog & { attackers: Player[]; defenders: Player[] };
  playerChanges: Record<
    number,
    {
      health: { prev: number; current: number };
      tileId: { prev: number; current: number };
    }
  >;
}) {
  return (
    <Card className="w-full grow">
      <CardContent className="flex flex-col items-start gap-3 p-3">
        {event.completedEventDescription}
        {event.attackers.map((p) => (
          <PlayerPreview key={p.id} player={p} playerChanges={playerChanges} />
        ))}
        {event.defenders.map((p) => (
          <PlayerPreview key={p.id} player={p} playerChanges={playerChanges} />
        ))}
      </CardContent>
    </Card>
  );
}

const PlayerPreview = ({
  player,
  playerChanges,
}: {
  player: Player;
  playerChanges: Record<
    number,
    {
      health: { prev: number; current: number };
      tileId: { prev: number; current: number };
    }
  >;
}) => {
  const changes = playerChanges[player.id];
  if (!changes) return null;
  return (
    <div className="flex flex items-center gap-3 p-3">
      <img
        src={player.image}
        className="h-10 w-10 rounded-full"
        alt={player.name}
      />
      <span className="line-clamp-2 max-w-sm text-lg font-normal">
        {player.name}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {changes.health.prev} {`->`} {changes.health.current}
        </span>
      </div>
    </div>
  );
};
