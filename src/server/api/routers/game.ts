import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { simulateNextDay } from "@/server/services/game";
import { type Player } from "@prisma/client";

const createEventSchema = z.object({
  teams: z.array(z.number()),
  tiles: z.array(
    z.object({
      q: z.number(),
      r: z.number(),
      s: z.number(),
      locationId: z.number(),
      hazardIds: z.array(z.number()),
    }),
  ),
});

export const gamesRouter = createTRPCRouter({
  create: publicProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      const players = await ctx.db.player.findMany({
        where: {
          teamId: {
            in: input.teams,
          },
        },
        select: {
          id: true,
        },
      });

      const game = await ctx.db.game.create({
        data: {
          players: {
            connect: players.map((p) => {
              return { id: p.id };
            }),
          },
        },
      });

      const createTilePromises = input.tiles.map(async (tile) => {
        await ctx.db.mapTile.create({
          data: {
            q: tile.q,
            r: tile.r,
            s: tile.s,
            locationId: tile.locationId,
            hazards: {
              connect: tile.hazardIds.map((h) => ({ id: h })),
            },
            gameId: game.id,
          },
        });
      });

      await Promise.all(createTilePromises);

      return {
        gameId: game.id,
      };
    }),
  simulateDays: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(({ input }) => simulateNextDay(input.gameId)),
  getGameDayInfo: publicProcedure
    .input(z.object({ gameId: z.number(), day: z.number() }))
    .query(async ({ ctx, input }) => {
      const log = await ctx.db.gameDayLog.findUnique({
        where: {
          gameId_day: {
            gameId: input.gameId,
            day: input.day,
          },
        },
        include: {
          game: true,
          playerStatuses: true,
          eventLogs: {
            include: {
              attackers: true,
              defenders: true,
            },
          },
        },
      });
      return log;
    }),
  getGame: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.gameId,
        },
        include: {
          players: true,
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
      return game;
    }),
  getGameStats: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.gameId,
        },
        include: {
          players: true,
        },
      });
      if (!game) return null;

      const dayLogs = await ctx.db.gameDayLog.findMany({
        where: {
          gameId: input.gameId,
        },
        include: {
          eventLogs: {
            include: {
              event: true,
              attackers: true,
              defenders: true,
            },
          },
          playerStatuses: true,
        },
      });

      const damageByPlayer: Record<number, number> = {};
      for (const log of dayLogs) {
        for (const eventLog of log.eventLogs) {
          for (const attacker of eventLog.attackers) {
            damageByPlayer[attacker.id] =
              (damageByPlayer[attacker.id] ?? 0) +
              eventLog.event.hpChangeDefenders;
          }
          for (const defender of eventLog.defenders) {
            damageByPlayer[defender.id] =
              (damageByPlayer[defender.id] ?? 0) +
              eventLog.event.hpChangeAttackers;
          }
        }
      }

      const killsByplayer: Record<number, number> = {};
      for (const log of dayLogs) {
        for (const eventLog of log.eventLogs) {
          const deadAttackers = log.playerStatuses
            .filter((ps) =>
              eventLog.attackers.some((a) => a.id === ps.playerId),
            )
            .map((ps) => ps.health)
            .filter((hp) => hp + eventLog.event.hpChangeAttackers <= 0).length;
          const deadDefenders = log.playerStatuses
            .filter((ps) =>
              eventLog.defenders.some((a) => a.id === ps.playerId),
            )
            .map((ps) => ps.health)
            .filter((hp) => hp + eventLog.event.hpChangeDefenders <= 0).length;

          for (const attacker of eventLog.attackers) {
            killsByplayer[attacker.id] =
              (killsByplayer[attacker.id] ?? 0) + deadAttackers;
          }
          for (const defender of eventLog.defenders) {
            killsByplayer[defender.id] =
              (killsByplayer[defender.id] ?? 0) + deadDefenders;
          }
        }
      }

      const traveledByPlayer: Record<number, number> = {};
      const playerLastSeenInTile: Record<number, number> = {};
      for (const log of dayLogs) {
        for (const player of log.playerStatuses) {
          if (playerLastSeenInTile[player.playerId] === undefined) {
            playerLastSeenInTile[player.playerId] = player.tileId;
            traveledByPlayer[player.playerId] = 0;
          } else {
            if (playerLastSeenInTile[player.playerId] !== player.tileId) {
              traveledByPlayer[player.playerId] =
                (traveledByPlayer[player.playerId] ?? 0) + 1;
              playerLastSeenInTile[player.playerId] = player.tileId;
            }
          }
        }
      }

      const damageByPlayerList: (Player & { damage: number })[] = [];
      for (const playerId in damageByPlayer) {
        damageByPlayerList.push({
          ...game.players.find((p) => p.id === parseInt(playerId))!,
          damage: -(damageByPlayer[playerId] ?? 0),
        });
      }

      const killsByPlayerList: (Player & { kills: number })[] = [];
      for (const playerId in killsByplayer) {
        killsByPlayerList.push({
          ...game.players.find((p) => p.id === parseInt(playerId))!,
          kills: killsByplayer[playerId] ?? 0,
        });
      }

      const traveledByPlayerList: (Player & { traveled: number })[] = [];
      for (const playerId in traveledByPlayer) {
        traveledByPlayerList.push({
          ...game.players.find((p) => p.id === parseInt(playerId))!,
          traveled: traveledByPlayer[playerId] ?? 0,
        });
      }

      const numberOfPlayersAliveByDay = dayLogs
        .sort((a, b) => a.day - b.day)
        .map((day) => day.playerStatuses.filter((ps) => ps.health > 0).length);

      return {
        damageByPlayer: damageByPlayerList.sort((a, b) => b.damage - a.damage),
        killsByPlayer: killsByPlayerList.sort((a, b) => b.kills - a.kills),
        traveledByPlayer: traveledByPlayerList.sort(
          (a, b) => b.traveled - a.traveled,
        ),
        numberOfPlayersAliveByDay,
      };
    }),
  getPlayerJorneyInGame: publicProcedure
    .input(z.object({ gameId: z.number(), playerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.gameId,
        },
        include: {
          players: true,
        },
      });
      if (!game) return null;

      const player = game.players.find((p) => p.id === input.playerId);
      if (!player) return null;

      const dayLogs = await ctx.db.gameDayLog.findMany({
        where: {
          gameId: input.gameId,
        },
        include: {
          game: true,
          playerStatuses: true,
          eventLogs: {
            where: {
              OR: [
                {
                  attackers: {
                    some: {
                      id: input.playerId,
                    },
                  },
                },
                {
                  defenders: {
                    some: {
                      id: input.playerId,
                    },
                  },
                },
              ],
            },
            include: {
              attackers: true,
              defenders: true,
            },
          },
        },
      });

      return {
        player: player,
        journey: dayLogs,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.game.findMany({
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
    return games;
  }),
  getGameForHistory: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const games = await ctx.db.game.findUniqueOrThrow({
        where: {
          id: input.gameId,
        },
        include: {
          gameDayLog: {
            include: {
              eventLogs: true,
              playerStatuses: true,
            },
          },
          tiles: true,
        },
      });
      return games;
    }),
});
