import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { registrationFormSchema } from "~/types/registration";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
        },
      };
    },
    jwt: ({ token, account, user }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.email = user.email;
        token.id = user.id;
        console.log({ user }, "from JWT callback");
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login/",
    error: "/auth/login/",
  },
  secret: env.JWT_SECRET,
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      authorize: async (credentials, req) => {
        const { email, password } = registrationFormSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user?.password) return null;
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid password",
          });
        console.log("hello from authorize", user);
        return user;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
