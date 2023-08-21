import classNames from "classnames";
import { type ReactNode } from "react";

export function NoteActionButton({
  children,
  onClick,
  variant = "basic",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "basic" | "error";
}) {
  const styles = classNames({
    "mr-2 flex items-center justify-center gap-2 border border-transparent px-4 py-1 text-gray-600 transition duration-3000":
      true,
    "hover:border-blue-500 hover:text-blue-500": variant === "basic",
    "hover:border-red-500 hover:text-red-500": variant === "error",
  });
  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
