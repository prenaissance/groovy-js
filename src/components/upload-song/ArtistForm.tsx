import { AddArtistSchema } from "@shared/artists/schemas";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useCallback, useRef, useState } from "react";
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
    formState: { errors, isValid },
  } = useForm<AddArtistForm>({
    resolver: zodResolver(AddArtistSchema),
    mode: "onChange",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const mutation = trpc.artists.addArtist.useMutation({
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
    [register]
  );

  const onSubmit = useCallback(
    (data: AddArtistForm) => {
      mutation.mutate(data);
      reset();
      onClose();
    },
    [mutation, onClose, reset]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-md border border-accent-light p-4 text-primary-contrast [scrollbar-width:thin]"
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
          className="min-w-[6rem]"
          variant="accent"
          outlined
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={!isValid}
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
