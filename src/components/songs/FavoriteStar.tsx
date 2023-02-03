import ShallowButton from "@components/ui/ShallowButton";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

type Props = {
  songId: string;
};

function FavoriteStar({ songId }: Props) {
  const session = useSession();
  const queryClient = trpc.useContext();
  const favoritePlaylistQuery = trpc.playlists.getPlaylist.useQuery({
    playlistTitle: "Favorites",
  });
  const mutateAdd = trpc.playlists.addSongToPlaylist.useMutation({
    onSettled: () => {
      queryClient.playlists.invalidate();
    },
  });
  const mutateRemove = trpc.playlists.removeSongFromPlaylist.useMutation({
    onSettled: () => {
      queryClient.playlists.invalidate();
    },
  });

  const isFavorite = useMemo(
    () =>
      !!favoritePlaylistQuery.data?.songs?.some((song) => song.id === songId),
    [favoritePlaylistQuery.data?.songs, songId],
  );

  const handleAction = useCallback(() => {
    if (isFavorite) {
      mutateRemove.mutate({
        playlistTitle: "Favorites",
        songId,
      });
    } else {
      mutateAdd.mutate({
        playlistTitle: "Favorites",
        songId,
      });
    }
  }, [isFavorite, mutateAdd, mutateRemove, songId]);

  return session.status === "authenticated" ? (
    <ShallowButton onClick={handleAction}>
      {isFavorite ? <BsStarFill size="32px" /> : <BsStar size="32px" />}
    </ShallowButton>
  ) : null;
}

export default FavoriteStar;
