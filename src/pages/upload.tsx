import TextField from "@components/ui/TextField";
import React, { useCallback } from "react";
import type { z } from "zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSongSchema } from "@shared/songs/schemas";
import FileUpload from "@components/ui/FileUpload";
import { fileToBase64 } from "@shared/utilities/files";
import Dialog from "@components/ui/Dialog";

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

  const [isArtistFormOpen, setIsArtistFormOpen] = React.useState(true);
  const [file, setFile] = React.useState<File | null>(null);

  const handleArtistFormClose = useCallback(() => {
    setIsArtistFormOpen(false);
  }, []);
  const handleArtistFormOpen = useCallback(() => {
    setIsArtistFormOpen(true);
  }, []);
  const handleFilesAdded = useCallback((files: File[]) => {
    if (files.length) {
      setFile(files[0]!);
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <form
        className="flex h-full w-full flex-col items-center justify-center"
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
      >
        <label htmlFor="title">Song title</label>
        <TextField id="title" {...register("title")} />
        <label htmlFor="artist">Artist (autocomplete)</label>
        <TextField id="artist" {...register("artist")} />
        <label htmlFor="album">Album (autocomplete)</label>
        <TextField id="album" {...register("album")} />
        <label htmlFor="year">Year</label>
        <TextField id="year" {...register("year")} />
        <label htmlFor="songUrl">Song URL</label>
        <TextField id="songUrl" {...register("songUrl")} />
        <FileUpload
          id="songFile"
          accept="audio/*"
          multiple={false}
          onFilesAdded={handleFilesAdded}
        />
        <Dialog open={isArtistFormOpen} onClose={handleArtistFormClose}>
          <div>Test</div>
        </Dialog>
      </form>
    </div>
  );
};

export default Upload;
