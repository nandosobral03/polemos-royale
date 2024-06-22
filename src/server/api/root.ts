import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { playersRouter, sponsorsRouter, teamsRouter } from "./routers/teams";

import { postRouter } from "@/server/api/routers/post";
import { eventsRouter } from "./routers/events";
import { locationsRouter } from "./routers/locations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  teams: teamsRouter,
  players: playersRouter,
  sponsors: sponsorsRouter,
  events: eventsRouter,
  locations: locationsRouter,
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
