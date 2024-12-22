"use server";
import { generateSasToken } from "./azureActions";

export const uploadFileToAzure = async (file: File, fileName: string) => {
  try {
    const sasUrl = await generateSasToken(fileName);

    if (!sasUrl) {
      return null;
    }

    const response = await fetch(sasUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
      },
      body: file,
    });

    const fileUrl = sasUrl.split("?")[0];
    if (response.ok) {
      return fileUrl;
    }

    return null;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}