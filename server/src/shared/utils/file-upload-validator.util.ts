import { env } from "@presentation/express/utils/constants/env.constants";
import { ValidationError } from "@presentation/express/utils/error-handling";

export function fileUploadValidator(
  url: string,
  publicId: string,
): void {

  if (!url || !publicId) {
    throw new ValidationError("Missing Cloudinary URL or publicId");
  }

  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new ValidationError("CLOUDINARY_CLOUD_NAME is not configured");
  }

  const urlPattern = new RegExp(`^https:\\/\\/res\\.cloudinary\\.com\\/${cloudName}\\/`);
  if (!urlPattern.test(url)) {
    throw new ValidationError("Invalid Cloudinary URL domain or account");
  }

}
