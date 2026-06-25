import { Upload, X, FileText } from 'lucide-react';
import type { KycFiles, KycPreviews } from '../types/KycTypes';

interface KycDocumentUploadProps {
    field: 'pan' | 'aadhaar';
    title: string;
    files: KycFiles;
    previews: KycPreviews;
    handleFileChange: (field: 'pan' | 'aadhaar' | 'selfie', file: File | null) => void;
    removeFile: (field: 'pan' | 'aadhaar' | 'selfie') => void;
}

export const KycDocumentUpload = ({ field, title, files, previews, handleFileChange, removeFile }: KycDocumentUploadProps) => {
    return (
        <div className="relative">
            {previews[field] ? (
                <div className="relative rounded-xl overflow-hidden border border-[#1e2025]">
                    <img
                        src={previews[field]!}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                    />
                    <button
                        onClick={() => removeFile(field)}
                        className="absolute top-3 right-3 bg-black/70 hover:bg-black p-2 rounded-full border border-[#1e2025] transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            ) : (
                <label
                    htmlFor={`upload-${field}`}
                    className="block border-2 border-dashed border-[#1e2025] hover:border-[#00C853]/50 rounded-xl p-12 text-center cursor-pointer transition-all bg-[#0b0c0e]"
                >
                    <Upload className="w-10 h-10 text-[#5a5f6e] mx-auto mb-3" />
                    <p className="text-[12px] font-medium text-[#e8eaed]">Click to upload {title} • Max 5MB</p>
                    <p className="text-[11px] font-medium text-[#5a5f6e] mt-1 tracking-wider uppercase">JPG or PNG only</p>
                </label>
            )}
            <input
                id={`upload-${field}`}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) => {
                    handleFileChange(field, e.target.files?.[0] || null);
                    e.target.value = '';
                }}
            />
        </div>
    );
};
