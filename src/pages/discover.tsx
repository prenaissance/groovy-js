import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { appRouter } from "@server/trpc/router/_app";
import { createContextInner } from "@server/trpc/context";
import { Genre } from "@prisma/client";
import { trpc } from "@utils/trpc";

const DISPLAYED_GENRES = [Genre.Metal, Genre.Rock] as const;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const promises: Promise<unknown>[] = [];

  promises.push(ssg.songs.getSongs.prefetchInfinite({}));
  DISPLAYED_GENRES.forEach((genre) => {
    promises.push(ssg.songs.getSongs.prefetchInfinite({ genre }));
  });

  await Promise.all(promises);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

function Discover({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>discover</div>;
}

export default Discover;
