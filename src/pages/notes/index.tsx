import classNames from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { HiArrowLongRight } from "react-icons/hi2";
import { GradientTitle } from "~/components/layoutWithTitle";
import { api } from "~/utils/api";
import { NotesLayout } from "./(NotesLayout)";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default function Notes() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/register/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

Notes.getLayout = (page: ReactNode) => <NotesLayout>{page}</NotesLayout>;
