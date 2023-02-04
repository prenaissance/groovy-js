import type { HTMLAttributes } from "react";
import clsx from "clsx";

import type { SongDto } from "@shared/songs/types";
import SongItem from "./SongItem";

type Props = {
  songs: SongDto[];
  caption: string;
  className: string;
} & HTMLAttributes<HTMLTableElement>;

function SongTable({ songs, caption, className, ...rest }: Props) {
  return (
    <table
      aria-label={caption}
      className={clsx("border-collapse border-0", className)}
      {...rest}
    >
      <thead>
        <tr className="border-b border-accent-light text-left font-sans text-lg">
          <th className="w-16 py-1 pl-4">Nr</th>
          <th>Title</th>
          <th>Album</th>
        </tr>
      </thead>
      <tbody className="divide divide-y divide-accent-light">
        {songs.map((song, index) => (
          <SongItem listIndex={index} key={song.id} song={song} />
        ))}
      </tbody>
    </table>
  );
}

export default SongTable;
