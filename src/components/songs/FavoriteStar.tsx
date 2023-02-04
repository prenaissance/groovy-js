import ShallowButton from "@components/ui/ShallowButton";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import type { HTMLAttributes } from "react";
import { useCallback, useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

type Props = {
  songId: string;
  size?: string;
} & HTMLAttributes<HTMLButtonElement>;

function FavoriteStar({ songId, size = "32px", ...rest }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const session = useSession();
  const queryClient = trpc.useContext();

  const playlistQuery = trpc.playlists.getPlaylist.useQuery(
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
    setIsFavorite((prevFlag) => !prevFlag);
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
    setIsFavorite(
      !!playlistQuery.data?.songs?.some((song) => song.id === songId),
    );
  }, [songId, playlistQuery.data?.songs]);

  return session.status === "authenticated" ? (
    <ShallowButton
      aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
      {...rest}
      onClick={handleAction}
    >
      {isFavorite ? <BsStarFill size={size} /> : <BsStar size={size} />}
    </ShallowButton>
  ) : null;
}

export default FavoriteStar;
