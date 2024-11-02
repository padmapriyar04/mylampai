import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

// Your environment variables or configuration
const accountName = process.env.AZURE_ACCOUNT_NAME || "";
const accountKey = process.env.AZURE_ACCOUNT_KEY || "";
const containerName = process.env.AZURE_CONTAINER_NAME || "";


export function generateSasToken(blobName: string): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  // Set up SAS token options
  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("c"), // 'c' for create permission
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour expiry
  };

  // Generate SAS query parameters
  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // Return the full URL including the SAS token query parameters
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}