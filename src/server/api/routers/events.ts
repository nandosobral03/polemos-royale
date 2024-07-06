import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const createEventSchema = z.object({
  description: z.string(),
  numberOfAttackers: z.number().min(0),
  numberOfDefenders: z.number().min(0),
  hpChangeAttackers: z.number(),
  hpChangeDefenders: z.number(),
  locationIds: z.array(z.number()),
  hazardIds: z.array(z.number()),
});

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.gameEvent.findMany({
      include: {
        locations: true,
        hazards: true,
      },
    }),
  ),
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
      const uniqueLocations = new Set(input.map((e) => e.locationIds).flat());
      const uniqueHazards = new Set(input.map((e) => e.hazardIds).flat());

      const eventsWithIds = input.map((e, i) => ({
        ...e,
        id: i,
      }));
      await ctx.db.gameEvent.deleteMany();
      await ctx.db.mapHazardSchematic.deleteMany();
      await ctx.db.mapLocationSchematic.deleteMany();

      await ctx.db.gameEvent.createMany({
        data: eventsWithIds.map((e) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { locationIds, hazardIds, ...rest } = e;
          return rest;
        }),
      });

      for (const locationId of uniqueLocations) {
        await ctx.db.mapLocationSchematic.create({
          data: {
            id: locationId,
            name: `Location ${locationId}`,
            image: "https://via.placeholder.com/150",
            events: {
              connect: eventsWithIds
                .filter((e) => e.locationIds.includes(locationId))
                .map((e) => ({ id: e.id })),
            },
          },
        });
      }

      for (const hazardId of uniqueHazards) {
        await ctx.db.mapHazardSchematic.create({
          data: {
            id: hazardId,
            name: `Hazard ${hazardId}`,
            events: {
              connect: eventsWithIds
                .filter((e) => e.hazardIds.includes(hazardId))
                .map((e) => ({ id: e.id })),
            },
          },
        });
      }

      return input;
    }),
});
