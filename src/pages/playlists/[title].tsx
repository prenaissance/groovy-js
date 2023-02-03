import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";

import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { createContextInner } from "@server/trpc/context";
import { appRouter } from "@server/trpc/router/_app";
import { trpc } from "@utils/trpc";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    title: string;
  }>,
) => {
  const { title } = context.params!;
  const session = await getServerAuthSession(context);

  if (!session) {
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
      <div>PlaylistPage</div>
    </>
  );
}

export default PlaylistPage;
