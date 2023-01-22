import { Genre } from "@prisma/client";

const genres = Object.values(Genre);

function Genres() {
  return <div>Genres</div>;
}

export default Genres;
