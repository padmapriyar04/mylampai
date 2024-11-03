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
export const generateSasToken = async (blobName: string) => {
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

export const generateSasUrlForInterview = async () => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  const sasOptions = {
    containerName,
    permissions: BlobSASPermissions.parse("cw"), 
    startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), 
    expiresOn: new Date(new Date().valueOf() + 1 * 3600 * 1000), 
  };

  try {
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();
    return `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  } catch (error) {
    console.error("Error generating SAS token:", error);
    return "";
  }
};
