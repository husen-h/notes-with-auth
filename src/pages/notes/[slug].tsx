import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { useContext, type ReactNode } from "react";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { NotesLayout } from "./(NotesLayout)";
import { api } from "~/utils/api";
import { GradientTitle } from "~/components/layoutWithTitle";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { marked } from "marked";
import { NoteActionButton } from "./(NoteActionButton)";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import sanitizeHtml from "sanitize-html";

dayjs.extend(relativeTime);

export default function NoteSlug(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const ctx = api.useContext();
  const router = useRouter();
  const { slug } = props;
  const { data: note, isLoading } = api.note.getNoteById.useQuery({
    id: slug,
  });

  const { mutate, isLoading: noteIsBeingDeleted } =
    api.note.deleteNote.useMutation({
      onSuccess: async () => {
        void ctx.note.getNotes.invalidate();
        await router.push("/notes");
        toast.success("Note deleted");
      },
    });

  const deleteNote = () => {
    mutate({ id: slug });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!note) return <p>404</p>;
  return (
    <div className="flex h-full grow flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <GradientTitle title={note.title} size="sm" />
          <span className="text-sm text-gray-500">
            created {dayjs(note.createdAt).fromNow()}
          </span>
        </div>
        <div>
          {noteIsBeingDeleted ? (
            <span>Deletion in process...</span>
          ) : (
            <NoteActionButton onClick={deleteNote} variant="error">
              Delete <HiOutlineArchiveBoxXMark size={20} />
            </NoteActionButton>
          )}
        </div>
      </div>
      <div className="grow bg-white p-4">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(marked(note.content)),
          }}
        />
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
