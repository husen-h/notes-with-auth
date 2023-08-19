import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { authOptions } from "~/server/auth";

export default function Home() {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <h1 className="text-8xl font-bold">
        <span>Gradient </span>
        <span className="bg-gradient-to-r from-blue-700 to-rose-600 bg-clip-text text-transparent">
          Text
        </span>
      </h1>
      {status === "authenticated" && (
        <button
          className="border border-slate-900 px-4 py-2 hover:bg-slate-600 hover:text-slate-100"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: "auth/register/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

type AuthorizationTabType = "login" | "register";
