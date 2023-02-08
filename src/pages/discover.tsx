import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { appRouter } from "@server/trpc/router/_app";
import { createContextInner } from "@server/trpc/context";
import { Genre } from "@prisma/client";
import SongCarousel from "@components/discover/song-carousel";
import Head from "next/head";
import useMediaQuery from "@hooks/useMediaQuery";

const DISPLAYED_GENRES = [Genre.Metal, Genre.Rock, Genre.Electronic] as const;

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
    revalidate: 30,
  };
};

function Discover({}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLessThanLg = useMediaQuery("(max-width: 1023px)");
  const songsPerPage = isLessThanLg ? 2 : 3;

  return (
    <>
      <Head>
        <title>Discover songs</title>
        <meta
          name="description"
          content="Discover new songs uploaded on Groovy.js!"
        />
      </Head>
      <div className="absolute left-1/2 w-full max-w-screen-lg -translate-x-1/2">
        <SongCarousel className="w-full" />
        {DISPLAYED_GENRES.map((genre) => (
          <SongCarousel
            className="w-full"
            key={genre}
            genre={genre}
            songsPerPage={songsPerPage}
          />
        ))}
        <div className="invisible h-20" />
      </div>
    </>
  );
}

export default Discover;
