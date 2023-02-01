import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import { blobStorage } from "../services/blob-storage/blob-storage";
import { virusScanner } from "../services/virus-scanner";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we don't have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 * */
export const createContextInner = async (opts: CreateContextOptions) => ({
  session: opts.session,
  prisma,
  blobStorage,
  virusScanner,
});

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 * */
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
