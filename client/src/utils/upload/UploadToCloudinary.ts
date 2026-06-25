import type { SignatureDataType } from "@shared/types/user/SignatureDataType";

export const uploadToCloudinary = async (file: File, signatureData: SignatureDataType) => {
  const { timestamp, signature, apiKey, cloudName, folder, allowedFormats } = signatureData;

  console.log("signatureData: ", signatureData)
  if (!timestamp || !signature || !apiKey || !cloudName) {
    throw new Error("Invalid Cloudinary signature data");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const url = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/"

  if (folder) formData.append("folder", folder);
  if (allowedFormats) formData.append("allowed_formats", allowedFormats);

  const resourceType = file.type === "application/pdf" ? "image" : "auto";

  const uploadUrl = `${url}${cloudName}/${resourceType}/upload`;

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