import classNames from "classnames";
import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface LinkProps {
  href: string;
  children?: ReactNode;
  type?: never;
  onClick?: never;
  outlined?: boolean;
}

interface ButtonProps {
  href?: never;
  children?: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  outlined?: boolean;
}

type Props = LinkProps | ButtonProps;

export function LinkButton({ href, children, type, onClick, outlined }: Props) {
  const styles = classNames({
    "border px-8 py-2 transition hover:bg-slate-900 flex items-center gap-2":
      true,
    "bg-slate-600 text-slate-100 hover:bg-slate-900": !outlined,
    "bg-white border-bg-slate-600 text-slate-600 hover:bg-slate-600 hover:text-slate-100":
      outlined,
  });

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
