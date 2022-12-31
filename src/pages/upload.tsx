import TextField from "@components/ui/TextField";
import React from "react";
import type { z } from "zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSongSchema } from "@shared/songs/schemas";
import FileUpload from "@components/FileUpload";

type AddSongForm = z.infer<typeof AddSongSchema>;

const Upload = () => {
  const mutation = trpc.songs.addSong.useMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSongForm>({
    resolver: zodResolver(AddSongSchema),
    mode: "onBlur",
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <form
        className="flex h-full w-full flex-col items-center justify-center"
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
      >
        <TextField {...register("title")} />
        <TextField {...register("artist")} />
        <TextField {...register("album")} />
        <TextField {...register("year")} />
        <TextField {...register("songUrl")} />
        <FileUpload />
      </form>
    </div>
  );
};

export default Upload;
