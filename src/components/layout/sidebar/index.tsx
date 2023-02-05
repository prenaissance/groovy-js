import { memo, useMemo } from "react";
import clsx from "clsx";
import { AiFillStar } from "react-icons/ai";
import { BsMusicNoteList } from "react-icons/bs";

import { trpc } from "@utils/trpc";
import Hamburger from "@components/ui/icons/Hamburger";
import HoverLink from "@components/ui/HoverLink";
import AddPlaylist from "./AddPlaylist";

type Props = {
  isOpen: boolean;
  onCollapse: () => void;
};

// TODO: Make a proper modal, there are problems with focusing other elements while open
function Sidebar({ isOpen, onCollapse }: Props) {
  const playlistsQuery = trpc.playlists.getPlaylistTitles.useQuery();
  const playlists = useMemo(
    () =>
      (playlistsQuery.data ?? []).filter(({ title }) => title !== "Favorites"),
    [playlistsQuery.data],
  );

  return (
    <>
      <div
        role="toolbar"
        className={clsx(
          "fixed inset-y-0 left-0 z-[50] flex w-64 flex-col overflow-x-hidden border-r border-accent-light bg-secondary pr-2 transition-transform duration-75 ease-out",
          {
            "visible translate-x-0": isOpen,
            "invisible -translate-x-64": !isOpen,
          },
        )}
      >
        <div className="my-1 ml-2 flex flex-col justify-between gap-2 divide-x divide-primary-contrast bg-secondary text-primary-contrast">
          <div className="ml-[5px] flex items-center lg:mb-4">
            <Hamburger aria-label="close sidebar" onClick={onCollapse} />
            <HoverLink onClick={onCollapse} href="/">
              Groovy
            </HoverLink>
          </div>
          <HoverLink onClick={onCollapse} href="/playlists/Favorites">
            <div className="flex items-center gap-2">
              <AiFillStar size="24px" />
              Favorites
            </div>
          </HoverLink>
          <p>Playlists</p>
          {playlists.map(({ id, title }) => (
            <HoverLink
              key={id}
              onClick={onCollapse}
              href={`/playlists/${title}`}
            >
              <div className="flex items-center gap-2">
                <BsMusicNoteList size="24px" />
                {title}
              </div>
            </HoverLink>
          ))}
          <AddPlaylist />
        </div>
      </div>
      <div
        className={clsx(
          "fixed inset-0 z-[20] bg-black/50 transition-opacity duration-75 ease-out",
          {
            "visible opacity-100": isOpen,
            "pointer-events-none invisible opacity-0": !isOpen,
          },
        )}
        onClick={onCollapse}
      />
    </>
  );
}

export default memo(Sidebar);
