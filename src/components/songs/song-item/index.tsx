import { useCallback } from "react";
import type { HTMLAttributes } from "react";
import Image from "next/image";
import clsx from "clsx";
import { BsPlayFill } from "react-icons/bs";

import type { SongDto } from "@shared/songs/types";
import usePlayerStore from "@stores/usePlayerStore";
import ShallowButton from "@components/ui/ShallowButton";
import FavoriteStar from "../FavoriteStar";
import SongOptions from "./SongOptions";

type Props = {
  song: SongDto;
  listIndex?: number;
} & HTMLAttributes<HTMLTableRowElement>;

function SongItem({ song, className, listIndex, ...rest }: Props) {
  const setCurrentSong = usePlayerStore((store) => store.setCurrentSong);

  const handleClick = useCallback(() => {
    setCurrentSong(song);
  }, [song, setCurrentSong]);

  return (
    <tr
      className={clsx(
        "group relative appearance-none focus-within:bg-white/10 hover:bg-white/10",
        className,
      )}
      {...rest}
    >
      <td className="w-fit">
        <ShallowButton
          aria-label={`Play ${song.title}`}
          className="relative ml-2"
          onClick={handleClick}
        >
          <BsPlayFill
            className="hidden group-focus-within:block group-hover:block"
            size="32px"
          />
          <p className="block w-7 text-center font-mono text-2xl group-focus-within:hidden group-hover:hidden">
            {listIndex}
          </p>
        </ShallowButton>
      </td>
      <td className="flex flex-wrap items-center py-2">
        <Image
          height={48}
          width={48}
          src={song.imageUrl}
          alt={`${song.artist.name} - ${song.title}`}
        />
        <div className="ml-2 truncate">
          <p className="font-mono text-lg">{song.title}</p>
          <p className="text-sm font-light text-gray-300">{song.artist.name}</p>
        </div>
      </td>
      <td className="align-middle font-sans text-lg text-gray-300">
        {song?.album?.title}
      </td>
      <div className="invisible absolute right-4 top-1/2 flex -translate-y-1/2 items-center space-x-2 group-focus-within:visible group-hover:visible">
        <FavoriteStar songId={song.id} size="24px" />
        <SongOptions songId={song.id} size="32px" position="left" />
      </div>
    </tr>
  );
}

export default SongItem;
