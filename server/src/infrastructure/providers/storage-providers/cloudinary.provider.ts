import type { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";

export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async getSignedUploadUrl(folder: string, userId: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const fullFolder = `${folder}/${userId}`;

    const paramsToSign = `folder=${fullFolder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign)
      .digest("hex");

    return {
      signature,
      timestamp,
      apiKey: env.CLOUDINARY_API_KEY || "",
      cloudName: env.CLOUDINARY_CLOUD_NAME || "",
      uploadPreset: env.CLOUDINARY_UPLOAD_PRESET || "",
      folder: fullFolder,
    };
  }
}
