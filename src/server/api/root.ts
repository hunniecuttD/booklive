import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { s3Router } from "~/server/api/routers/s3";
import { profileRouter } from "~/server/api/routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  s3: s3Router,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
