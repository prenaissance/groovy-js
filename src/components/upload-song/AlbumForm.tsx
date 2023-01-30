import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { trpc } from "@utils/trpc";

import { fileToBase64 } from "@shared/utilities/files";
import { AddAlbumSchema } from "@shared/albums/schemas";
import TextField from "@components/ui/TextField";
import FileUpload from "@components/ui/FileUpload";
import Button from "@components/ui/Button";
import NotificationBar from "@components/ui/NotificationBar";
import ChipsAutocomplete from "@components/ui/ChipsAutocomplete";
import { Genre } from "@prisma/client";
import Autocomplete from "@components/ui/Autocomplete";

type AddAlbumForm = z.infer<typeof AddAlbumSchema>;
type Props = {
  onClose: () => void;
};

const genres = Object.values(Genre);

function AlbumForm({ onClose }: Props) {
  const queryClient = trpc.useContext();
  const artists = trpc.artists.getArtistNames.useQuery().data;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddAlbumForm>({
    resolver: zodResolver(AddAlbumSchema),
    mode: "onChange",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const mutation = trpc.albums.addAlbum.useMutation({
    onMutate: () => {
      setErrorMessage("");
    },
    onSuccess: () => {
      queryClient.artists.invalidate();
      reset();
      onClose();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const artistOptions = useMemo(
    () =>
      (artists ?? []).map((artist) => ({
        label: artist.name,
        value: artist.id,
      })),
    [artists],
  );

  const handleFilesAdded = useCallback(
    async (files: File[]) => {
      if (files.length) {
        const file = files[0]!;
        const base64 = await fileToBase64(file);
        setValue("imageFile", base64, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleChangeGenres = useCallback(
    (data: string[]) => {
      setValue("genres", data as Genre[], { shouldValidate: true });
    },
    [setValue],
  );

  const handleSelectArtist = useCallback(
    (data: string) => {
      setValue("artistId", data, { shouldValidate: true });
    },
    [setValue],
  );

  const onSubmit = useCallback(
    (data: AddAlbumForm) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-h-[80vh] w-96 flex-col gap-4 overflow-y-auto rounded-md border border-accent-light p-4 text-primary-contrast [scrollbar-width:thin]"
    >
      <NotificationBar variant="error" message={errorMessage} />
      <label className="flex flex-col gap-2">
        Title
        <TextField
          errorMessage={errors.title?.message}
          {...register("title")}
        />
      </label>
      <label className="flex flex-col gap-2">
        Artist
        <Autocomplete
          className="w-full"
          options={artistOptions}
          name="artistId"
          onSelectedChange={handleSelectArtist}
          errorMessage={errors.artistId?.message}
        />
      </label>

      <label className="flex flex-col gap-2">
        Year
        <TextField
          type="number"
          errorMessage={errors.year?.message}
          {...register("year")}
        />
      </label>
      <label className="flex flex-col gap-2">
        Genres
        <ChipsAutocomplete
          className="w-full"
          options={genres}
          onSelectedChange={handleChangeGenres}
          errorMessage={errors.genres?.message}
        />
      </label>
      <label className="flex flex-col gap-2">
        Album Cover Image Url
        <TextField
          helperText="Or upload the image file"
          errorMessage={errors.imageUrl?.message}
          {...register("imageUrl")}
        />
      </label>
      <label className="flex flex-col gap-2">
        Album Cover Image File
        <FileUpload
          className="mx-auto"
          accept="image/*"
          multiple={false}
          onFilesAdded={handleFilesAdded}
        />
      </label>
      <div className="mx-auto space-x-2">
        <Button
          type="button"
          className="min-w-[6rem]"
          variant="accent"
          outlined
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={!isValid}
          loading={mutation.isLoading}
          className="min-w-[6rem]"
          type="submit"
          variant="primary"
        >
          Add Album
        </Button>
      </div>
    </form>
  );
}

export default AlbumForm;
