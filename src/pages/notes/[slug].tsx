import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { type ReactNode } from "react";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { NotesLayout } from "./(layout)";

export default function NoteSlug(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  return <div>{slug}</div>;
}

export const getServerSideProps: GetServerSideProps<{ slug: string }> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/register/",
        permanent: false,
      },
    };
  }
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      session: null,
    },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;
  if (typeof slug !== "string") {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }

  await helpers.notes.getNoteById.prefetch({ id: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
NoteSlug.getLayout = (page: ReactNode) => <NotesLayout>{page}</NotesLayout>;
