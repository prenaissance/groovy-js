import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { trpc } from "@utils/trpc";
import { AddArtistSchema } from "@shared/artists/schemas";
import { fileToBase64 } from "@shared/utilities/files";
import TextField from "@components/ui/TextField";
import FileUpload from "@components/ui/FileUpload";
import Button from "@components/ui/Button";
import NotificationBar from "@components/ui/NotificationBar";

type AddArtistForm = z.infer<typeof AddArtistSchema>;
type Props = {
  onClose: () => void;
};

function ArtistForm({ onClose }: Props) {
  const queryClient = trpc.useContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddArtistForm>({
    resolver: zodResolver(AddArtistSchema),
    mode: "onChange",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const mutation = trpc.artists.addArtist.useMutation({
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
        setValue("imageFile", base64);
      }
    },
    [setValue],
  );

  const onSubmit = useCallback(
    (data: AddArtistForm) => {
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
      className="flex max-w-md flex-col gap-4 rounded-md border border-accent-light p-4 text-primary-contrast [scrollbar-width:thin]"
    >
      <NotificationBar variant="error" message={errorMessage} />
      <label className="flex flex-col gap-2">
        Name
        <TextField {...register("name")} errorMessage={errors.name?.message} />
      </label>
      <label className="flex flex-col gap-2">
        Image Url
        <TextField
          helperText="Or upload the image file"
          errorMessage={errors.imageUrl?.message}
          {...register("imageUrl")}
        />
      </label>
      <label className="flex flex-col gap-2">
        Image File
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

export default ArtistForm;
