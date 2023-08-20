import { type ReactNode } from "react";

export function LayoutWithTitle({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-8">
      <Title title={title} />
      {children}
    </main>
  );
}

function Title({ title }: { title: string }) {
  return (
    <h1 className="mt-4 text-8xl font-bold">
      <span className="bg-gradient-to-r from-blue-700 to-rose-600 bg-clip-text text-transparent">
        {title}
      </span>
    </h1>
  );
}
