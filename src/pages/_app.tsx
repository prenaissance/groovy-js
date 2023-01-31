import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import RootLayout from "@components/layout/RootLayout";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

// eslint-disable-next-line react/function-component-definition
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <RootLayout>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </RootLayout>
);

export default trpc.withTRPC(MyApp);
