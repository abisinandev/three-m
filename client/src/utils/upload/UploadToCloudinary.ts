import type { SignatureDataType } from "@shared/types/user/SignatureDataType";

export const uploadToCloudinary = async (file: File, signatureData: SignatureDataType) => {
  const { timestamp, signature, apiKey, cloudName, folder } = signatureData;

  if (!timestamp || !signature || !apiKey || !cloudName) {
    throw new Error("Invalid Cloudinary signature data");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  if (folder) formData.append("folder", folder);

  const resourceType = file.type === "application/pdf" ? "image" : "auto";

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary upload failed:", data);
    throw new Error(data.error?.message || "Upload failed");
  }

  return data;
};