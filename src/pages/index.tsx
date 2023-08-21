import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import { LayoutWithTitle } from "~/components/layoutWithTitle";
import { authOptions } from "~/server/auth";

export default function Home({
  loggedIn,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <LayoutWithTitle title={"Notes-taking"}>
      {loggedIn ? (
        <Link
          href="/notes"
          className="group flex items-center border border-l-0 border-r-0 border-t-0 border-b-blue-600 text-blue-600"
        >
          <p className="pr-2 text-xl transition-[padding] duration-200 ease-in group-hover:pr-6">
            Continue to notes
          </p>
          <HiArrowLongRight size={28} className="text-blue-600" />
        </Link>
      ) : (
        <Link
          className="border bg-slate-600 px-8 py-2 text-slate-100 transition hover:bg-slate-900"
          href="/auth/register"
        >
          Sign in
        </Link>
      )}
    </LayoutWithTitle>
  );
}

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      loggedIn: Boolean(session),
    },
  };
};
