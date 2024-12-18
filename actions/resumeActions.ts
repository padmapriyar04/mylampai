"use server";
import { generateSasToken } from "./azureActions";

export const uploadResumeToAzure = async (file: File, fileName: string) => {
  try {
    const sasUrl = await generateSasToken(fileName);

    console.log("Uploading resume to:", sasUrl);
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

    const resumeUrl = sasUrl.split("?")[0];
    if (response.ok) {
      return resumeUrl;
    }

    return null;
  } catch (error) {
    console.error("Error uploading resume:", error);
    return null;
  }
};
