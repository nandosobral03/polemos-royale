import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const createLocationSchema = z.object({
  name: z.string(),
  image: z.string(),
});

export const locationsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.mapLocationSchematic.findMany({
      include: {
        events: true,
      },
    }),
  ),
  create: publicProcedure
    .input(createLocationSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.mapLocationSchematic.create({
        data: input,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapLocationSchematic.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(createLocationSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapLocationSchematic.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  setLocationEvents: publicProcedure
    .input(z.object({ id: z.number(), events: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.mapLocationSchematic.update({
        where: {
          id: input.id,
        },
        data: {
          events: {
            set: input.events.map((e) => ({ id: e })),
          },
        },
      });
    }),
});

const createHazardSchema = z.object({
  name: z.string(),
});

export const hazardsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.mapHazardSchematic.findMany({
      include: {
        events: true,
      },
    }),
  ),
  create: publicProcedure
    .input(createHazardSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.mapHazardSchematic.create({
        data: input,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapHazardSchematic.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(createHazardSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapHazardSchematic.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  setHazardEvents: publicProcedure
    .input(z.object({ id: z.number(), events: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.mapHazardSchematic.update({
        where: {
          id: input.id,
        },
        data: {
          events: {
            set: input.events.map((e) => ({ id: e })),
          },
        },
      });
    }),
});
