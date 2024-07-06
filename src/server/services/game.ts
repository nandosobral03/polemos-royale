import {
  generateEventDescriptionText,
  getRandomElement,
  randomizeArray,
} from "@/lib/utils";
import { db } from "@/server/db";
import {
  type Game,
  type GameEvent,
  type MapTile,
  type Player,
} from "@prisma/client";

const getStartOfDayPlayerStatuses = async (
  game: Game & { players: Player[]; tiles: MapTile[] },
) => {
  const lastKnownDayLog = await db.gameDayLog.findFirst({
    where: {
      gameId: game.id,
    },
    orderBy: {
      day: "desc",
    },
    include: {
      playerStatuses: {
        include: {
          player: true,
        },
      },
    },
  });

  let playerStatuses: {
    playerId: number;
    health: number;
    tileId: number;
    name: string;
  }[] = [];
  if (!lastKnownDayLog) {
    playerStatuses = game?.players.map((p) => ({
      playerId: p.id,
      name: p.name,
      health: 100,
      tileId: getRandomElement(game.tiles).id,
    }));
  } else {
    playerStatuses = lastKnownDayLog.playerStatuses.map((ps) => ({
      playerId: ps.playerId,
      name: ps.player.name,
      health: ps.health,
      tileId: ps.tileId,
    }));
  }
  return playerStatuses;
};
const moveToCenter = (tile: { q: number; r: number; s: number }) => {
  let { q, r, s } = tile;

  if (q > 0) {
    q -= 1;
    s += 1;
  } else if (q < 0) {
    q += 1;
    s -= 1;
  } else if (r > 0) {
    r -= 1;
    q += 1;
  } else if (r < 0) {
    r += 1;
    q -= 1;
  } else if (s > 0) {
    s -= 1;
    r += 1;
  } else if (s < 0) {
    s += 1;
    r -= 1;
  }

  return { q, r, s };
};

const movePlayer = (
  oldTileId: number,
  game: Game & { tiles: MapTile[] },
  shrinkedLevel: 0 | 1 | 2 | 3 = 0,
) => {
  const oldTile = game.tiles.find((t) => t.id === oldTileId);

  if (!oldTile) throw new Error("Tile not found");
  const currentLevel = Math.max(
    Math.abs(oldTile.q),
    Math.abs(oldTile.r),
    Math.abs(oldTile.s),
  );
  const maxAllowedLevel = 3 - shrinkedLevel;
  console.log(maxAllowedLevel);
  if (currentLevel > maxAllowedLevel) {
    const { q, r, s } = moveToCenter(oldTile);

    const newTile = game.tiles.find((t) => t.q === q && t.r === r && t.s === s);
    console.log(oldTile.q, oldTile.r, oldTile.s);
    if (!newTile) return oldTileId;
    return newTile.id;
  }

  const direction: "q" | "r" | "s" = getRandomElement(["q", "r", "s"]);
  const amount: -1 | 0 | 1 = getRandomElement([-1, 0, 1]);

  const idealNewTile = {
    q: oldTile.q + direction === "q" ? oldTile.q : oldTile.q + amount,
    r: oldTile.r + direction === "r" ? oldTile.r : oldTile.r + amount,
    s: oldTile.s + direction === "s" ? oldTile.s : oldTile.s + amount,
  };

  const newTile = game.tiles.find(
    (t) =>
      t.q === idealNewTile.q &&
      t.r === idealNewTile.r &&
      t.s === idealNewTile.s,
  );
  if (!newTile) return oldTileId;
  return newTile.id;
};

export const simulateNextDay = async (gameId: number) => {
  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      players: true,
      gameDayLog: true,
      tiles: {
        include: {
          location: {
            include: { events: true },
          },
          hazards: {
            include: { events: true },
          },
        },
      },
    },
  });
  if (!game) return false;
  const playerStatuses = await getStartOfDayPlayerStatuses(game);
  if (playerStatuses.length === 0 || playerStatuses.length === 1) return false;
  const playerStatusesByTile = playerStatuses.reduce(
    (acc, ps) => {
      acc[ps.tileId] = [...(acc[ps.tileId] ?? []), ps];
      return acc;
    },
    {} as Record<number, { playerId: number; health: number; name: string }[]>,
  );

  const resultingStatuses: {
    playerId: number;
    health: number;
    tileId: number;
  }[] = [];
  const resultingEvents: {
    event: GameEvent;
    attackers: { playerId: number; name: string }[];
    defenders: { playerId: number; name: string }[];
    tileId: number;
  }[] = [];
  for (const tile of game.tiles) {
    const events = tile.location.events.concat(
      tile.hazards.map((h) => h.events).flat(),
    );
    const playersByTile = randomizeArray(
      JSON.parse(
        JSON.stringify(playerStatusesByTile[tile.id] ?? []),
      ) as (typeof playerStatusesByTile)[number],
    );

    if (!playersByTile.length) continue;
    while (playersByTile.length > 0) {
      const selectedEvent = getRandomElement(
        events.filter(
          (e) =>
            playersByTile.length >= e.numberOfAttackers + e.numberOfDefenders,
        ),
      );
      const attackers = playersByTile.splice(
        0,
        selectedEvent.numberOfAttackers,
      );
      const defenders = playersByTile.splice(
        0,
        selectedEvent.numberOfDefenders,
      );

      const resultingTileStatuses = attackers
        .map((a) => ({
          playerId: a.playerId,
          name: a.name,
          health: a.health + selectedEvent.hpChangeAttackers,
          tileId: tile.id,
        }))
        .concat(
          defenders.map((d) => ({
            playerId: d.playerId,
            name: d.name,
            health: d.health + selectedEvent.hpChangeDefenders,
            tileId: tile.id,
          })),
        );

      resultingStatuses.push(...resultingTileStatuses);
      resultingEvents.push({
        event: selectedEvent,
        attackers,
        defenders,
        tileId: tile.id,
      });
    }
  }

  const day = game.gameDayLog.length + 1;
  const shrinkedLevel = Math.min(3, Math.floor((day + 1) / 5)) as 0 | 1 | 2 | 3;

  const resultingStatusesWithNewTiles = resultingStatuses
    .filter((s) => s.health > 0)
    .map((s) => ({ ...s, tileId: movePlayer(s.tileId, game, shrinkedLevel) }));

  const gameLog = await db.gameDayLog.create({
    data: {
      day,
      gameId: game.id,
    },
  });

  await db.playerDayStatus.createMany({
    data: resultingStatusesWithNewTiles.map((s) => ({
      gameId: game.id,
      day: gameLog.day,
      playerId: s.playerId,
      health: s.health,
      tileId: s.tileId,
    })),
  });

  await Promise.all(
    resultingEvents.map(async (event) => {
      await db.gameEventLog.create({
        data: {
          gameDayLogId: gameLog.id,
          tileId: event.tileId,
          completedEventDescription: generateEventDescriptionText(event.event, [
            ...event.attackers.map((a) => a.name),
            ...event.defenders.map((d) => d.name),
          ]),
          eventId: event.event.id,
          attackers: {
            connect: event.attackers.map((p) => ({
              id: p.playerId,
            })),
          },
          defenders: {
            connect: event.defenders.map((p) => ({
              id: p.playerId,
            })),
          },
        },
      });
    }),
  );
  return true;
};
