import { getBufferFromBase64 } from "@server/common/files/get-buffer-from-base64";
import { getContainerClient } from "./get-container-client";

export const uploadBase64File = async (
  file: string,
  containerName: string,
  name: string
) => {
  const { buffer, mime, extension } = getBufferFromBase64(file);
  const fileName = `${name}-${Date.now()}.${extension}`;
  const containerClient = await getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mime,
    },
  });
  return blockBlobClient.url;
};
