import clsx from "clsx";
import Image from "next/image";

type Props = {
  color?: "primary" | "secondary" | "accent";
  src: string;
  className?: string;
  title?: string;
};

function MediaCard({ color = "primary", src, title = "", className }: Props) {
  return (
    <section className={clsx(className, "")}>
      <figure>
        <Image src={src} alt={title} className="h-full w-full object-cover" />
        <figcaption className="text-center">{title}</figcaption>
      </figure>
      <div role="toolbar">Play</div>
    </section>
  );
}

export default MediaCard;
