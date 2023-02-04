import ShallowButton from "@components/ui/ShallowButton";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

type Props = {
  songId: string;
  size?: string;
};

function FavoriteStar({ songId, size = "32px" }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const session = useSession();
  const queryClient = trpc.useContext();

  const { data } = trpc.playlists.getPlaylist.useQuery(
    {
      playlistTitle: "Favorites",
    },
    {
      enabled: session.status === "authenticated",
      onSuccess: (data) => {
        setIsFavorite(!!data?.songs?.some((song) => song.id === songId));
      },
    },
  );

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

  const handleAction = useCallback(() => {
    setIsFavorite((isFavorite) => !isFavorite);
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

  useEffect(() => {
    setIsFavorite(!!data?.songs?.some((song) => song.id === songId));
  }, [songId]);

  return session.status === "authenticated" ? (
    <ShallowButton onClick={handleAction}>
      {isFavorite ? <BsStarFill size={size} /> : <BsStar size={size} />}
    </ShallowButton>
  ) : null;
}

export default FavoriteStar;
