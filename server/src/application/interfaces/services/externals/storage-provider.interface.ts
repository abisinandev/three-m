export interface IStorageProvider {
  getSignedUploadUrl(
    folder: string,
  ): Promise<{
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    uploadPreset: string;
    folder: string;
    allowedFormats: string;
  }>;
  verifyAsset(publicId: string): Promise<any>;
  deleteAsset(publicId: string): Promise<void>;
}
