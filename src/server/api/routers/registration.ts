import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { registrationFormSchema } from "~/types/registration";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";

export const registrationRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(registrationFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (foundUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return user;
    }),
});
