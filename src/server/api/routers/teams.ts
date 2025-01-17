import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const teamsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.team.findMany({ include: { sponsor: true, players: true } }),
  ),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        sponsorId: z.number().optional(),
        players: z.array(z.number()),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.team.create({
        data: {
          name: input.name,
          sponsorId: input.sponsorId,
          players: {
            connect: input.players.map((p) => ({ id: p })),
          },
        },
      }),
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.team.delete({ where: { id: input.id } }),
    ),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        sponsorId: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.team.update({
        where: { id: input.id },
        data: { name: input.name, sponsorId: input.sponsorId },
      }),
    ),
  updatePlayers: publicProcedure
    .input(z.object({ id: z.number(), players: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.player.updateMany({
        where: { teamId: input.id },
        data: { teamId: null },
      });
      await ctx.db.player.updateMany({
        where: { id: { in: input.players } },
        data: { teamId: input.id },
      });
    }),
  massUploadTeams: publicProcedure
    .input(
      z.object({
        players: z.array(
          z.object({
            name: z.string().min(1),
            image: z.string(),
            teamName: z.string().optional(),
          }),
        ),
        teams: z.array(
          z.object({
            name: z.string().min(1),
            sponsorName: z.string().optional(),
          }),
        ),
        sponsors: z.array(z.object({ name: z.string().min(1) })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.team.deleteMany({});
      await ctx.db.player.deleteMany({});
      await ctx.db.sponsor.deleteMany({});

      const sponsors = await ctx.db.sponsor.createManyAndReturn({
        data: input.sponsors.map((s) => ({
          name: s.name,
          image: "https://via.placeholder.com/150",
        })),
      });

      const teamsToCreate = input.teams.map((t) => ({
        name: t.name,
        sponsorId: sponsors.find((s) => s.name === t.sponsorName)?.id ?? null,
      }));

      const teams = await ctx.db.team.createManyAndReturn({
        data: teamsToCreate.map((t) => ({
          name: t.name,
          sponsorId: t.sponsorId,
        })),
      });

      const players = input.players.map((p) => ({
        name: p.name,
        image: p.image,
        teamId: teams.find((t) => t.name === p.teamName)?.id ?? null,
      }));
      await ctx.db.player.createMany({ data: players });
    }),
});

const createPlayerSchema = z.object({
  name: z.string().min(1),
  teamId: z.number().optional(),
  image: z.string(),
});

export const playersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.player.findMany({
      include: { team: true },
    }),
  ),
  create: publicProcedure
    .input(createPlayerSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.player.create({
        data: { name: input.name, teamId: input.teamId, image: input.image },
      }),
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.player.delete({ where: { id: input.id } }),
    ),
  update: publicProcedure
    .input(createPlayerSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.player.update({
        where: { id: input.id },
        data: { name: input.name, teamId: input.teamId, image: input.image },
      }),
    ),
  getAllPlayersWithNoTeam: publicProcedure.query(({ ctx }) =>
    ctx.db.player.findMany({ where: { teamId: null } }),
  ),
});

const createSponsorSchema = z.object({
  name: z.string().min(1),
  image: z.string(),
});
export const sponsorsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.sponsor.findMany({ include: { teams: true } }),
  ),
  create: publicProcedure
    .input(createSponsorSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.sponsor.create({ data: { name: input.name, image: input.image } }),
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.sponsor.delete({ where: { id: input.id } }),
    ),
  update: publicProcedure
    .input(createSponsorSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.sponsor.update({
        where: { id: input.id },
        data: { name: input.name, image: input.image },
      }),
    ),
});
