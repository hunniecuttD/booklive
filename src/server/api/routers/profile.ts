import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const signupShape = z.object({ 
  displayName: z.string(),
  // profileType: z.string(),
  primaryInstrument: z.string(),
  profileImage: z.string(),
  skillLevel: z.number(),
  zipcode: z.string(),
  // otherInstruments: z.array(z.string()),
  bio: z.string(),
  // lookingForBand: z.boolean(),
})

export const profileRouter = createTRPCRouter({
  signup: protectedProcedure.input(signupShape).mutation(({ input, ctx }) => {
    console.log("signup", input, ctx.session);
  }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `yooooooo ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!!!";
  }),
});
