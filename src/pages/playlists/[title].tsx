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
import Image from "next/image";

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
      <div className="m-4 lg:m-8 xl:m-12">
        <header className="flex ">
          <div className="m-2 flex justify-center pr-20">
            {playlistQuery.data?.previewImages?.map((imageUrl, index) => (
              <Image
                key={imageUrl}
                className="-mr-20 rounded-full shadow-xl shadow-black/50 outline outline-1 outline-accent-light"
                style={{
                  zIndex: playlistQuery.data.previewImages.length - index,
                }}
                src={imageUrl}
                alt={`Playlist preview image ${index + 1}`}
                width={160}
                height={160}
                priority
              />
            ))}
          </div>
          <div className="flex flex-col justify-center gap-4">
            <p className="text-gray-300">Playlist</p>
            <h1 className="font-sans text-6xl font-bold">
              {playlistQuery.data?.title}
            </h1>
            <p className="text-gray-300">
              {playlistQuery.data?.songs?.length ?? 0} songs
            </p>
          </div>
        </header>
        <SongTable
          className="mb-16 w-full"
          caption={`${title} playlist songs`}
          songs={playlistQuery.data?.songs ?? []}
        />
      </div>
    </>
  );
}

export default PlaylistPage;
