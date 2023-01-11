import React, { useCallback, useRef, useState } from "react";
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

type AddAlbumForm = z.infer<typeof AddAlbumSchema>;
type Props = {
  onClose: () => void;
};

const genres = Object.values(Genre);

function AlbumForm({ onClose }: Props) {
  const queryClient = trpc.useContext();
  const {
    register,
    handleSubmit,
    reset,
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

  const handleFilesAdded = useCallback(
    async (files: File[]) => {
      if (files.length) {
        const file = files[0]!;
        const base64 = await fileToBase64(file);
        register("imageFile", { value: base64 });
      }
    },
    [register],
  );

  const onSubmit = useCallback(
    (data: AddAlbumForm) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-4 rounded-md border border-accent-light p-4 text-primary-contrast [scrollbar-width:thin]"
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
        Year
        <TextField errorMessage={errors.year?.message} {...register("year")} />
      </label>
      <label className="flex flex-col gap-2">
        Genres
        <ChipsAutocomplete
          className="w-full"
          options={genres}
          errorMessage={errors.genres?.message}
          {...register("genres")}
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
          type="reset"
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
          Add Artist
        </Button>
      </div>
    </form>
  );
}

export default AlbumForm;
