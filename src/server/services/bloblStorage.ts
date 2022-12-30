import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { env } from "@env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var blobStorage: BlobServiceClient | undefined;
}

const blobUrl = `https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/songs`;

export const blobStorage =
  global.blobStorage ||
  new BlobServiceClient(
    blobUrl,
    new StorageSharedKeyCredential(
      env.AZURE_STORAGE_ACCOUNT_NAME,
      env.AZURE_STORAGE_ACCOUNT_KEY
    )
  );

if (env.NODE_ENV !== "production") {
  global.blobStorage = blobStorage;
}