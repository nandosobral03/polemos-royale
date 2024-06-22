import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const createHazardSchema = z.object({
  name: z.string(),
});

export const hazardsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.gameEvent.findMany()),
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
  addEventsToHazard: publicProcedure
    .input(z.object({ id: z.number(), events: z.array(z.number()) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapHazardSchematic.update({
        where: {
          id: input.id,
        },
        data: {
          events: { connect: input.events.map((eventId) => ({ id: eventId })) },
        },
      });
    }),
  removeEventsFromHazard: publicProcedure
    .input(z.object({ id: z.number(), eventId: z.array(z.number()) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.mapHazardSchematic.update({
        where: {
          id: input.id,
        },
        data: {
          events: {
            disconnect: input.eventId.map((eventId) => ({ id: eventId })),
          },
        },
      });
    }),
});
