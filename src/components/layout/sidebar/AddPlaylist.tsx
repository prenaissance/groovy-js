import Button from "@components/ui/Button";
import ShallowButton from "@components/ui/ShallowButton";
import TextField from "@components/ui/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { z } from "zod";

function AddPlaylist() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = trpc.useContext();
  const playlistsQuery = trpc.playlists.getPlaylistTitles.useQuery();
  const playlistTitles = useMemo(
    () => playlistsQuery.data ?? [],
    [playlistsQuery.data],
  );

  const mutate = trpc.playlists.createPlaylist.useMutation({
    onSuccess: () => {
      queryClient.playlists.invalidate();
      setIsFormOpen(false);
    },
  });

  const TitleSchema = z.object({
    title: z
      .string()
      .min(1)
      .max(50)
      .refine(
        (title) => !playlistTitles.some((song) => song.title === title),
        "PLaylist title already exists",
      ),
  });
  type TitleInput = z.infer<typeof TitleSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TitleInput>({
    resolver: zodResolver(TitleSchema),
  });

  const onSubmit = useCallback(
    (data: TitleInput) => {
      mutate.mutate(data.title);
    },
    [mutate],
  );

  return (
    <div className="flex items-center gap-2 pl-2">
      {isFormOpen ? (
        <>
          <AiOutlinePlusCircle size="24px" />
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-fit gap-1">
            <TextField
              aria-label="New playlist title"
              className="w-auto"
              type="text"
              placeholder="Playlist title"
              {...register("title")}
              errorMessage={errors.title?.message}
            />
            <Button className="p-1" type="submit" variant="positive" noGutters>
              Add
            </Button>
          </form>
        </>
      ) : (
        <ShallowButton
          className="flex w-auto items-center gap-2"
          onClick={() => {
            setIsFormOpen(true);
          }}
        >
          <AiOutlinePlusCircle size="24px" />
          Add playlist
        </ShallowButton>
      )}
    </div>
  );
}

export default AddPlaylist;
