import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const createEventSchema = z.object({
  description: z.string(),
  numberOfAttackers: z.number().min(0),
  numberOfDefenders: z.number().min(0),
  hpChangeAttackers: z.number(),
  hpChangeDefenders: z.number(),
});

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.gameEvent.findMany()),
  create: publicProcedure
    .input(createEventSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.gameEvent.create({
        data: input,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.gameEvent.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(createEventSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.gameEvent.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  massUploadEvents: publicProcedure
    .input(z.array(createEventSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.gameEvent.deleteMany();
      await ctx.db.gameEvent.createMany({
        data: input,
      });
      return input;
    }),
});
