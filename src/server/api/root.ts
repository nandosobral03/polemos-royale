import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { playersRouter, sponsorsRouter, teamsRouter } from "./routers/teams";

import { eventsRouter } from "./routers/events";
import { hazardsRouter, locationsRouter } from "./routers/locations";
import { gamesRouter } from "./routers/game";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  teams: teamsRouter,
  players: playersRouter,
  sponsors: sponsorsRouter,
  events: eventsRouter,
  locations: locationsRouter,
  hazards: hazardsRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
