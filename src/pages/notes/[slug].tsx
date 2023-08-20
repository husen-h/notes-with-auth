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
import { api } from "~/utils/api";
import { GradientTitle } from "~/components/layoutWithTitle";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NoteSlug(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: note, isLoading } = api.note.getNoteById.useQuery({
    id: slug,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!note) return <p>404</p>;
  return (
    <div className="flex h-full grow flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <GradientTitle title={note.title} size="sm" />
        <span className="text-sm text-gray-500">
          created {dayjs(note.createdAt).fromNow()}
        </span>
      </div>
      <div className="grow bg-white p-4">
        <p>{note.content}</p>
      </div>
    </div>
  );
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
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;
  if (typeof slug !== "string") {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }

  await helpers.note.getNoteById.prefetch({ id: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
NoteSlug.getLayout = (page: ReactNode) => <NotesLayout>{page}</NotesLayout>;
