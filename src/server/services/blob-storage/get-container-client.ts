import { blobStorage } from "./blob-storage";

export const getContainerClient = async (containerName: string) => {
  const containerClient = blobStorage.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  await containerClient.setAccessPolicy("blob");

  return containerClient;
};
