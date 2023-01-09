import { getContainerClient } from "./get-container-client";

export const uploadUrlFile = async (
  url: string,
  containerName: string,
  name: string
) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const mime = response.headers.get("content-type")!;
  const extension = mime.split("/")[1]!;
  const fileName = `${name}-${Date.now()}.${extension}`;

  const containerClient = await getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadData(arrayBuffer, {
    blobHTTPHeaders: {
      blobContentType: mime,
    },
  });
  return blockBlobClient.url;
};
