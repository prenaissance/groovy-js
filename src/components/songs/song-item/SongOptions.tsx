import { AiOutlineEllipsis } from "react-icons/ai";

import ExpandableMenu from "@components/ui/ExpandableMenu";
import type { Position } from "@components/ui/ExpandableMenu";
import ShallowButton from "@components/ui/ShallowButton";
import { trpc } from "@utils/trpc";
import type { ReactNode } from "react";
import { memo } from "react";

type AddToPLaylistProps = {
  songId: string;
  playlistId: string;
  children: ReactNode;
};

function AddSongToPlaylistComponent({
  songId,
  playlistId,
  children,
}: AddToPLaylistProps) {
  const queryClient = trpc.useContext();
  const mutation = trpc.playlists.addSongToPlaylist.useMutation({
    onSuccess: () => {
      queryClient.playlists.invalidate();
    },
  });
  const handleMutation = () => {
    mutation.mutate({ songId, playlistId });
  };

  return (
    <ShallowButton onClick={handleMutation} className="w-full">
      {children}
    </ShallowButton>
  );
}

const AddSongToPlaylist = memo(AddSongToPlaylistComponent);

type Props = {
  songId: string;
  size?: string;
  position?: Position;
};

function SongOptions({ songId, size = "32px", position = "bottom" }: Props) {
  const playlistsQuery = trpc.playlists.getPlayLists.useQuery(undefined, {
    select: (data) =>
      data
        .filter((playlist) => playlist.songs.some(({ id }) => id !== songId))
        .map(({ id, title }) => ({ id, title })),
  });
  const shownPlaylists = playlistsQuery.data ?? [];

  return (
    <ExpandableMenu
      position={position}
      buttonContent={<AiOutlineEllipsis size={size} />}
    >
      <li>
        <ExpandableMenu
          position={position}
          buttonContent={<span>Add to playlist</span>}
        >
          {shownPlaylists.map(({ id, title }) => (
            <li key={id}>
              <AddSongToPlaylist songId={songId} playlistId={id}>
                {title}
              </AddSongToPlaylist>
            </li>
          ))}
        </ExpandableMenu>
      </li>
    </ExpandableMenu>
  );
}

export default SongOptions;
