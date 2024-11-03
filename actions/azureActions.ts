"use server";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

const accountName = process.env.AZURE_ACCOUNT_NAME || "";
const accountKey = process.env.AZURE_ACCOUNT_KEY || "";
const containerName = process.env.AZURE_CONTAINER_NAME || "";

// SAS Token Generator Function
export const generateSasToken = (blobName: string) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("c"),
    startsOn: new Date(new Date().valueOf() - 1 * 60 * 1000),
    expiresOn: new Date(new Date().valueOf() + 4 * 60 * 1000),
  };

  try {
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();
    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
  } catch (error) {
    console.error("Error generating SAS token:", error);
    return "";
  }
};
