import { useCallback, useMemo, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import type { Genre, Song } from "@prisma/client";
import { trpc } from "@utils/trpc";
import ShallowButton from "@components/ui/ShallowButton";
import usePlayerStore from "@stores/usePlayerStore";
import type { ArrayElementType } from "@custom-types/ArrayElementType";
import SongCard from "./SongCard";

type Props = {
  genre?: Genre;
  className?: string;
};

const DEFAULT_LIMIT = 6;
const SONGS_PER_PAGE = 3;

function SongCarousel({ genre, className }: Props) {
  const songsQuery = trpc.songs.getSongs.useInfiniteQuery(
    { genre, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { data, hasNextPage, fetchNextPage } = songsQuery;
  const [page, setPage] = useState(0);
  const { setCurrentSong } = usePlayerStore.getState();

  const loadedSongs = useMemo(
    () =>
      (data?.pages ?? [])
        .flatMap((p) => p.songs)
        .map((song) => ({
          ...song,
          imageUrl: song.album?.imageUrl ?? song.artist.imageUrl,
        })),
    [data?.pages],
  );

  const handleChangePageLeft = useCallback(
    () => setPage((lastPage) => lastPage - 1),
    [],
  );

  const handleChangePageRight = useCallback(() => {
    if (!hasNextPage) return;

    setPage((lastPage) => lastPage + 1);
    // optimistically fetch next page if there are 3 or less songs left
    const lastSongIndex = (page + 1) * SONGS_PER_PAGE;
    if (lastSongIndex + SONGS_PER_PAGE >= loadedSongs.length) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, loadedSongs.length, page]);

  const getSelectSongHandler = useCallback(
    (song: ArrayElementType<typeof loadedSongs>) => () => {
      // eslint-disable-next-line no-console
      console.log("select song", song);
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
          <AiOutlineLeft size="24px" />
        </ShallowButton>
        <div className="grid aspect-[3/1] h-full flex-1 translate-x-0 grid-cols-3 gap-4 transition-transform duration-300 ease-in-out">
          {loadedSongs
            .slice(page * SONGS_PER_PAGE, (page + 1) * SONGS_PER_PAGE)
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
          disabled={!hasNextPage}
          onClick={handleChangePageRight}
        >
          <AiOutlineRight size="24px" />
        </ShallowButton>
      </div>
    </section>
  );
}

export default SongCarousel;
