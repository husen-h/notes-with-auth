import { type Note } from "@prisma/client";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";
import { toast } from "react-hot-toast";
import { HiArrowLongRight } from "react-icons/hi2";
import { GradientTitle } from "~/components/layoutWithTitle";
import { api } from "~/utils/api";

export function NotesLayout({ children }: PropsWithChildren) {
  return (
    <section className="flex h-screen flex-col">
      <Header />
      <div className="flex grow">
        <SavedNotes />
        <div className="grow px-4">{children}</div>
      </div>
    </section>
  );
}

function SavedNotes() {
  const ctx = api.useContext();
  const { data, isLoading } = api.notes.getNotes.useQuery();
  const { mutate: createNote } = api.notes.createNote.useMutation({
    onSuccess: () => {
      toast.success("Note created!");
      void ctx.notes.getNotes.invalidate();
    },
  });

  const notes = data ?? [];

  const containerStyles = classNames({
    "shrink-0 grow-0 basis-60 border-r border-r-gray-200 px-4 flex flex-col":
      true,
    "justify-center items-center": notes.length === 0,
  });

  return (
    <div className={containerStyles}>
      {notes.length === 0 ? (
        <h2
          className="text-2xl font-bold text-gray-300"
          onClick={() => {
            createNote({ title: "test title", content: "test content" });
          }}
        >
          {isLoading ? "Loading..." : "No notes"}
        </h2>
      ) : (
        <>
          {(notes ?? []).map((note) => (
            <SavedNote key={note.id} note={note} />
          ))}
        </>
      )}
    </div>
  );
}

function SavedNote({ note }: { note: Note }) {
  const { query } = useRouter();
  const styles = classNames({
    "text-red-500": note.id === query.slug,
  });
  return (
    <Link key={note.id} href={`/notes/${note.id}`} className={styles}>
      {note.title}
    </Link>
  );
}

function Header() {
  return (
    <nav className="grid shrink-0 grow-0 basis-20 grid-cols-3 items-center bg-white">
      <div className="col-start-2 self-center justify-self-center">
        <GradientTitle title="Notes-taking" size="md" />
      </div>
      <div className="col-start-3 justify-self-end">
        <button
          onClick={() => signOut()}
          className="mx-2 flex gap-2 border border-white px-4 py-1 transition duration-300 hover:border-blue-500 hover:text-blue-500"
        >
          Sign out
          <HiArrowLongRight size={28} />
        </button>
      </div>
    </nav>
  );
}
