import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import {
  type AppContext,
  type AppInitialProps,
  type AppLayoutProps,
} from "next/app";
import type { NextComponentType } from "next";
import { type PropsWithChildren, type ReactNode } from "react";
import { LayoutWithTitle } from "~/components/layoutWithTitle";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout: (page: ReactNode) => ReactNode =
    Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <SessionProvider session={session}>
      {getLayout(
        <>
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </>
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
