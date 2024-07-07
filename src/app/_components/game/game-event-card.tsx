import { Card, CardContent } from "@/components/ui/card";
import { type GameEventLog, type Player } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function GameEventCard({
  event,
  playerChanges,
  gameId,
}: {
  event: GameEventLog & { attackers: Player[]; defenders: Player[] };
  gameId: number;
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
          <Link href={`/games/${gameId}/player/${p.id}`} key={p.id}>
            <PlayerPreview player={p} playerChanges={playerChanges} />
          </Link>
        ))}
        {event.defenders.map((p) => (
          <Link href={`/games/${gameId}/player/${p.id}`} key={p.id}>
            <PlayerPreview
              key={p.id}
              player={p}
              playerChanges={playerChanges}
            />
          </Link>
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
  return (
    <div className="flex flex items-center gap-3 p-3">
      <Image
        src={player.image}
        className="h-10 w-10 rounded-full"
        alt={player.name}
        height={128}
        width={128}
      />
      <span className="line-clamp-2 max-w-sm text-lg font-normal">
        {player.name}
      </span>
      <div className="flex items-center gap-2">
        {changes ? (
          <span className="text-sm text-gray-500">
            {changes.health.prev} {`->`} {changes.health.current}
          </span>
        ) : (
          // Players that died on the first day meaning there are no changes lmao
          <span className="text-sm text-gray-500">100 {`->`} 0</span>
        )}
      </div>
    </div>
  );
};
