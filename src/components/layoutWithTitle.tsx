import classNames from "classnames";
import { type ReactNode } from "react";

export function LayoutWithTitle({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-8 pt-4">
      <GradientTitle title={title} />
      {children}
    </main>
  );
}

export function GradientTitle({
  title,
  size = "xl",
}: {
  title: string;
  size?: "sm" | "md" | "xl";
}) {
  const headerClassnames = classNames({
    "font-bold": true,
    "text-xl": size === "sm",
    "text-4xl": size === "md",
    "text-8xl": size === "xl",
  });
  return (
    <h1 className={headerClassnames}>
      <span className="bg-gradient-to-r from-blue-700 to-rose-600 bg-clip-text text-transparent">
        {title}
      </span>
    </h1>
  );
}
