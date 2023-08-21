import { type ReactNode } from "react";

export function NoteActionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mr-2 flex items-center justify-center gap-2 border border-transparent px-4 py-1 text-gray-600 transition duration-300 hover:border-blue-500 hover:text-blue-500"
    >
      {children}
    </button>
  );
}
