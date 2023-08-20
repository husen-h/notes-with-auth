import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { registrationRouter } from "./routers/registration";
import { notesRouter } from "./routers/notes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  registration: registrationRouter,
  notes: notesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
