// next.d.ts

import type {
  NextComponentType,
  NextPageContext,
  NextLayoutComponentType,
} from "next";
import { type Session } from "next-auth";
import type { AppProps, AppType } from "next/app";

declare module "next" {
  type NextLayoutComponentType<P = unknown> = NextComponentType<
    NextPageContext,
    unknown,
    P
  > & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}

declare module "next/app" {
  type AppLayoutProps<P = unknown> = AppType<{ session: Session | null }> & {
    Component: NextLayoutComponentType;
    pageProps: {
      session: Session;
    };
  };
}
