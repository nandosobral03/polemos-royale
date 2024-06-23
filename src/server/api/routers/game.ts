import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { simulateNextDay } from "@/server/services/game";

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
    .input(z.object({ days: z.number(), gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await simulateNextDay(input.gameId);
    }),
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
});
