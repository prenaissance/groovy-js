import TextField from "@components/ui/TextField";
import React, { useCallback, useState } from "react";
import type { z } from "zod";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSongSchema } from "@shared/songs/schemas";
import FileUpload from "@components/ui/FileUpload";
import { fileToBase64 } from "@shared/utilities/files";
import Dialog from "@components/ui/Dialog";
import Autocomplete from "@components/ui/Autocomplete";
import { BiPlusCircle } from "react-icons/bi";
import ArtistForm from "@components/upload-song/ArtistForm";
import AlbumForm from "@components/upload-song/AlbumForm";

type AddSongForm = z.infer<typeof AddSongSchema>;

function Upload() {
  const queryClient = trpc.useContext();
  const artistNames = trpc.artists.getArtistNames.useQuery().data ?? [];
  const mutation = trpc.songs.addSong.useMutation({
    onSuccess: () => {
      queryClient.artists.invalidate();
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSongForm>({
    resolver: zodResolver(AddSongSchema),
    mode: "onBlur",
  });

  const [isArtistFormOpen, setIsArtistFormOpen] = useState(false);
  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  const handleArtistFormClose = useCallback(() => {
    setIsArtistFormOpen(false);
  }, []);
  const handleArtistFormOpen = useCallback(() => {
    setIsArtistFormOpen(true);
  }, []);
  const handleAlbumFormClose = useCallback(() => {
    setIsAlbumFormOpen(false);
  }, []);
  const handleAlbumFormOpen = useCallback(() => {
    setIsAlbumFormOpen(true);
  }, []);
  const handleFilesAdded = useCallback((files: File[]) => {
    if (files.length) {
      setFile(files[0]!);
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
      >
        <fieldset className="grid grid-cols-2 items-stretch justify-items-stretch gap-4 rounded-md border border-accent-light p-4 sm:mt-4 lg:mt-16">
          <legend className="text-xs text-gray-400">
            Complete the form for adding a song
          </legend>
          <label>
            Song title
            <TextField {...register("title")} />
          </label>
          <label>
            Artist
            <div className="flex flex-row items-center justify-start">
              <Autocomplete
                className="flex-1"
                helperText="Add an artist if you can't find them in the list!"
                options={artistNames}
                {...register("artist")}
              />
              <button
                type="button"
                className="hover:bg-secondary-dark/20 align-center flex flex-row justify-center self-start p-1 text-secondary-contrast"
                onClick={handleArtistFormOpen}
              >
                <BiPlusCircle size="1.5rem" />
              </button>
            </div>
          </label>
          <label>
            Year
            <TextField {...register("year")} />
          </label>
          <label>
            Album
            <div className="flex flex-row items-center justify-start">
              <Autocomplete
                className="flex-1"
                helperText="Register the album if you can't find it!"
                options={[]}
                {...register("album")}
              />
              <button
                type="button"
                className="hover:bg-secondary-dark/20 flex flex-row items-center justify-start self-start p-1 text-secondary-contrast"
                onClick={handleAlbumFormOpen}
              >
                <BiPlusCircle size="1.5rem" />
              </button>
            </div>
          </label>
          <label className="col-span-2">
            Song URL
            <TextField
              helperText="Or upload a file"
              className="w-full"
              id="songUrl"
              {...register("songUrl")}
            />
          </label>
          <FileUpload
            className="col-span-2 mx-auto h-32 w-full"
            id="songFile"
            accept="audio/*"
            multiple={false}
            onFilesAdded={handleFilesAdded}
          />
        </fieldset>
      </form>
      <Dialog isOpen={isArtistFormOpen} onClose={handleArtistFormClose}>
        <ArtistForm onClose={handleArtistFormClose} />
      </Dialog>
      <Dialog isOpen={isAlbumFormOpen} onClose={handleAlbumFormClose}>
        <AlbumForm />
      </Dialog>
    </div>
  );
}

export default Upload;
