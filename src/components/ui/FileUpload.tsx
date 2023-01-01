import React, { useState } from "react";
import type { DragEvent, FC, InputHTMLAttributes } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import clsx from "clsx";

type Props = {
  onFilesAdded?: (files: File[]) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const FileUpload: FC<Props> = ({
  onFilesAdded = () => {},
  className,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string>("");
  const ref = React.createRef<HTMLInputElement>();

  const handleFilesAdded = (files: File[]) => {
    onFilesAdded(files);
    setFileNames(files.map((file) => file.name).join(", "));
  };

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
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    ref.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <>
      <div
        tabIndex={0}
        role="input"
        className={clsx(
          "flex h-fit w-fit flex-col items-center justify-center rounded-md border-2 border-dashed px-2 py-8 hover:border-primary-contrast focus:border-primary-contrast",
          {
            "border-primary-contrast": isDragging,
            "border-accent-light": !isDragging,
          },
          className
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
          {...props}
          onChange={handleFileInputChange}
        />
        <div className="pointer-events-none flex h-full items-center justify-center text-primary-contrast">
          <FaCloudUploadAlt aria-hidden />
          <div className="ml-2 select-none text-sm font-medium">
            Drag and drop audio files here or click to select files
          </div>
        </div>
      </div>
      {fileNames && (
        <div className="mt-2 text-sm font-medium text-primary-contrast">
          {`Selected: ${fileNames}`}
        </div>
      )}
    </>
  );
};
export default FileUpload;
