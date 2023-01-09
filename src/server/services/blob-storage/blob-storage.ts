import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { env } from "@env/server.mjs";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var blobStorage: BlobServiceClient | undefined;
}

const containerUrl = `https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

export const blobStorage =
  global.blobStorage ||
  new BlobServiceClient(
    containerUrl,
    new StorageSharedKeyCredential(
      env.AZURE_STORAGE_ACCOUNT_NAME,
      env.AZURE_STORAGE_ACCOUNT_KEY,
    ),
  );

if (env.NODE_ENV !== "production") {
  global.blobStorage = blobStorage;
}
