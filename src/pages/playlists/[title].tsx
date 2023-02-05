import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";

import { trpc } from "@utils/trpc";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router/_app";
import SongTable from "@components/songs/SongTable";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    title: string;
  }>,
) => {
  const { title } = context.params!;
  const session = await getServerAuthSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: `api/auth/signin?callbackUrl=${encodeURIComponent(
          context.resolvedUrl,
        )}`,
        permanent: false,
      },
    };
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.playlists.getPlaylist.prefetch({ playlistTitle: title });

  return {
    props: {
      dehydratedState: ssg.dehydrate(),
      title,
    },
  };
};

function PlaylistPage({
  title,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const playlistQuery = trpc.playlists.getPlaylist.useQuery({
    playlistTitle: title,
  });

  return (
    <>
      <Head>
        <title>{`Playlist - ${title}`}</title>
      </Head>
      <SongTable
        className="w-none mx-4 lg:mx-8 xl:mx-12"
        caption={`${title} playlist songs`}
        songs={playlistQuery.data?.songs ?? []}
      />
    </>
  );
}

export default PlaylistPage;
