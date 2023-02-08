import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import type { Genre } from "@prisma/client";
import { trpc } from "@utils/trpc";
import ShallowButton from "@components/ui/ShallowButton";
import usePlayerStore from "@stores/usePlayerStore";
import type { ArrayElementType } from "@custom-types/ArrayElementType";
import SongCard from "./SongCard";

type Props = {
  genre?: Genre;
  className?: string;
  songsPerPage?: number;
  limit?: number;
};

function SongCarousel({
  genre,
  className,
  songsPerPage = 3,
  limit = 6,
}: Props) {
  const songsQuery = trpc.songs.getSongs.useInfiniteQuery(
    { genre, limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { data, hasNextPage, fetchNextPage } = songsQuery;
  const [page, setPage] = useState(0);
  const { setCurrentSong } = usePlayerStore.getState();

  const loadedSongs = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.songs),
    [data?.pages],
  );

  const canMoveToNextPage =
    hasNextPage || page + 1 < loadedSongs.length / songsPerPage;

  useEffect(() => {
    // optimistically fetch next page if there are 3 or less songs left
    if (!hasNextPage) return;

    const lastSongIndex = (page + 1) * songsPerPage;
    if (lastSongIndex + songsPerPage >= loadedSongs.length) {
      fetchNextPage();
    }
  }, [page, fetchNextPage, loadedSongs.length, hasNextPage, songsPerPage]);

  const handleChangePageLeft = useCallback(
    () => setPage((lastPage) => lastPage - 1),
    [],
  );

  const handleChangePageRight = useCallback(() => {
    if (!canMoveToNextPage) return;

    setPage((lastPage) => lastPage + 1);
  }, [canMoveToNextPage]);

  const getSelectSongHandler = useCallback(
    (song: ArrayElementType<typeof loadedSongs>) => () => {
      setCurrentSong(song);
    },
    [setCurrentSong],
  );

  return (
    <section className={className}>
      <h2 className="text-center font-mono text-lg font-semibold uppercase tracking-wider text-primary-contrast">
        {genre ?? "Latest"}
      </h2>
      <div className="flex items-center">
        <ShallowButton
          aria-label="move list left"
          disabled={!page}
          onClick={handleChangePageLeft}
        >
          <AiOutlineLeft size="32px" />
        </ShallowButton>
        <div className="grid aspect-[3/1] h-full flex-1 translate-x-0 grid-cols-3 gap-4 transition-transform duration-300 ease-in-out">
          {loadedSongs
            .slice(page * songsPerPage, (page + 1) * songsPerPage)
            .map((song) => (
              <SongCard
                key={song.id}
                onClick={getSelectSongHandler(song)}
                title={`${song.title} - ${song.artist.name}`}
                src={song.imageUrl}
              />
            ))}
        </div>
        <ShallowButton
          aria-label="move list right"
          disabled={!canMoveToNextPage}
          onClick={handleChangePageRight}
        >
          <AiOutlineRight size="32px" />
        </ShallowButton>
      </div>
    </section>
  );
}

export default SongCarousel;
