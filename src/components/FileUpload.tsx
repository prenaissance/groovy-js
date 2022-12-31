import React, { useState, forwardRef } from "react";
import type { DragEvent, FC, Ref } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import clsx from "clsx";

type Props = {
  onFilesAdded?: (files: File[]) => void;
  accept?: string;
};

const FileUpload: FC<Props> = (
  { onFilesAdded = null, accept = "audio/*" },
  ref: Ref<HTMLInputElement>
) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    ref.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={clsx(
        "flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed",
        {
          "border-primary-contrast": isDragging,
          "border-accent-light": !isDragging,
        }
      )}
      onClick={handleClick}
      onDragStart={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={ref}
        className="hidden"
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
      />
      <div className="flex h-full items-center justify-center">
        <FaCloudUploadAlt className="text-gray-600" />
        <div className="ml-2 text-sm font-medium text-gray-600">
          Drag and drop audio files here or click to select files
        </div>
      </div>
    </div>
  );
};
export default forwardRef(FileUpload);
