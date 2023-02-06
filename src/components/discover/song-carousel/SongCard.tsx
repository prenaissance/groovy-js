import { memo } from "react";
import type { MouseEventHandler } from "react";
import Image from "next/image";

type Props = {
  src: string;
  title: string;
  onClick?: MouseEventHandler;
};

function SongCard({ src, title, onClick }: Props) {
  return (
    <button
      className="aspect-square w-full overflow-hidden rounded-sm border-0 bg-transparent text-center text-primary-contrast shadow-lg outline-2 outline-blue-500 focus:outline active:outline"
      type="button"
      onClick={onClick}
      aria-label={`Play song ${title}`}
    >
      <figure className="group relative aspect-square cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-1/5 after:w-full after:bg-gradient-to-b after:from-transparent after:to-black/60 after:content-['']">
        <Image
          className="object-contain"
          alt={title}
          fill
          src={src}
          sizes="33vw"
          quality={100}
          crossOrigin="anonymous"
          priority
        />
        <figcaption className="group-hover:move-text bg-gradient absolute bottom-0 left-0 z-10 w-full overflow-hidden whitespace-nowrap px-1">
          {title}
        </figcaption>
      </figure>
    </button>
  );
}

export default memo(SongCard);
