export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export type FileUploadType = 'pan' | 'aadhaar' | 'selfie' | 'profile';

export const ValidateFileUploads = (file: File, type: FileUploadType): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';

    if (!isImage) {
      return resolve({ isValid: false, error: 'Only JPG and PNG images are allowed' });
    }

    if (file.size > maxSize) {
      return resolve({ isValid: false, error: 'File must be under 5MB' });
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ isValid: false, error: 'Invalid image file. The image could not be loaded or is corrupted.' });
    };

    img.src = objectUrl;
  });
};
