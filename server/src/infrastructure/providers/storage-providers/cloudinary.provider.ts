import type { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import { v2 as cloudinary } from "cloudinary";

export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async getSignedUploadUrl(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const fullFolder = folder;
    const allowedFormats = "jpg,png,jpeg,webp";

    const paramsToSign = {
      folder: fullFolder,
      timestamp,
      allowed_formats: allowedFormats,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    ); //signature key

    return {
      signature,
      timestamp,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
      folder: fullFolder,
      allowedFormats,
    };
  }

  async verifyAsset(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.log(`Failed to verify asset ${publicId} on Cloudinary`);
    }
  }

  async deleteAsset(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete asset ${publicId} on Cloudinary`, error);
    }
  }
}
