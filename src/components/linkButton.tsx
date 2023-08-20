import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface LinkProps {
  href: string;
  children?: ReactNode;
  type?: never;
  onClick?: never;
}

interface ButtonProps {
  href?: never;
  children?: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
}

type Props = LinkProps | ButtonProps;

export function LinkButton({ href, children, type, onClick }: Props) {
  const styles =
    "border bg-slate-600 px-8 py-2 text-slate-100 transition hover:bg-slate-900 flex items-center gap-2";

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles}>
      {children}
    </button>
  );
}
