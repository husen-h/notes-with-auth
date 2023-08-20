import { type Note } from "@prisma/client";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, type PropsWithChildren, useState } from "react";
import { toast } from "react-hot-toast";
import { BiExit } from "react-icons/bi";
import {
  HiArrowLongRight,
  HiOutlinePlus,
  HiPlus,
  HiXMark,
} from "react-icons/hi2";
import { GradientTitle } from "~/components/layoutWithTitle";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as Dialog from "@radix-ui/react-dialog";

dayjs.extend(relativeTime);

export function NotesLayout({ children }: PropsWithChildren) {
  return (
    <section className="flex h-screen flex-col">
      <Header />
      <div className="flex grow basis-0 overflow-hidden">
        <SavedNotes />
        <div className="grow px-4">{children}</div>
      </div>
    </section>
  );
}

function SavedNotes() {
  const { data, isLoading } = api.note.getNotes.useQuery();
  const notes = data ?? [];

  const containerStyles = classNames({
    "shrink-0 grow-0 basis-80 border-r border-r-gray-300 flex flex-col overflow-auto":
      true,
    "justify-center items-center": notes.length === 0,
  });

  return (
    <div className={containerStyles}>
      {notes.length === 0 ? (
        <h2 className="text-2xl font-bold text-gray-300">
          {isLoading ? "Loading..." : "No notes"}
        </h2>
      ) : (
        <div className="flex flex-col">
          {notes.map((note) => (
            <SavedNote key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedNote({ note }: { note: Note }) {
  const { query } = useRouter();
  const linkStyles = classNames({
    "bg-gray-200": note.id === query.slug,
    "flex flex-col pl-4": true,
  });
  return (
    <>
      <Link
        key={note.id}
        href={note.id === query.slug ? "/notes/" : `/notes/${note.id}`}
        className={linkStyles}
      >
        <div className="my-4">
          <h2 className="-mb-1 font-bold">{note.title}</h2>
          <span className="text-sm">{dayjs(note.createdAt).fromNow()}</span>
        </div>
        <hr className="border-gray-300" />
      </Link>
    </>
  );
}

function Header() {
  return (
    <nav className="grid shrink-0 grow-0 basis-20 grid-cols-3 items-center bg-white">
      <div className="col-start-2 justify-self-center">
        <GradientTitle title="Notes-taking" size="md" />
      </div>
      <div className="col-start-3 flex justify-self-end">
        <CreateNewNote />
        <HeaderButton onClick={() => signOut()}>
          Sign out
          <BiExit size={20} />
        </HeaderButton>
      </div>
    </nav>
  );
}

function HeaderButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mr-2 flex items-center justify-center gap-2 border border-white px-4 py-1 text-gray-600 transition duration-300 hover:border-blue-500 hover:text-blue-500"
    >
      {children}
    </button>
  );
}

function CreateNewNote() {
  const [open, setOpen] = useState(false);
  //   const { mutate } = api.notes.createNote.useMutation({
  //     onSuccess: () => {
  //       void ctx.notes.getNotes.invalidate();
  //     },
  //   });
  //   const ctx = api.useContext();

  //   const createNote = () => {
  //     mutate({
  //       title: Math.random().toString(),
  //       content: Math.random().toString(),
  //     });
  //   };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <HeaderButton onClick={() => setOpen(true)}>
        Create
        <HiOutlinePlus size={20} />
      </HeaderButton>
      <Dialog.Portal>
        <Dialog.Overlay className="po fixed inset-0 bg-slate-700 opacity-50" />
        <Dialog.Content className="fixed top-0 flex h-screen w-screen items-center justify-center">
          <div className="w-[450px] bg-white p-4">
            <div className="flex justify-between">
              <GradientTitle size="sm" title="Create new note" />
              <Dialog.Close>
                <HiXMark size={20} className="cursor-pointer outline-none" />
              </Dialog.Close>
            </div>
            <div className="flex flex-col"></div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
