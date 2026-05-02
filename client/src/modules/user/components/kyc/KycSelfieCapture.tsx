import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { KycFiles, KycPreviews } from './KycTypes';

interface KycSelfieCaptureProps {
    files: KycFiles;
    previews: KycPreviews;
    handleFileChange: (field: 'pan' | 'aadhaar' | 'selfie', file: File | null) => void;
    removeFile: (field: 'pan' | 'aadhaar' | 'selfie') => void;
    isActive: boolean;
}

export const KycSelfieCapture = ({ files, previews, handleFileChange, removeFile, isActive }: KycSelfieCaptureProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            toast.error('Camera access denied. Please allow permission.');
        }
    };

    const stopCamera = () => {
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
                handleFileChange('selfie', file);
                stopCamera();
            }
        }, 'image/jpeg', 0.95);
    };

    useEffect(() => {
        if (isActive && !files.selfie) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isActive, files.selfie]);

    return (
        <div className="space-y-4">
            {!files.selfie ? (
                <div className="relative rounded-xl overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-96 object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-80 border-4 border-white/30 rounded-3xl" />
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <button
                            onClick={capturePhoto}
                            className="w-20 h-20 bg-white rounded-full shadow-2xl ring-4 ring-gray-900/50 hover:bg-gray-200 transition-colors"
                        />
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-[#1e2025]">
                    <img src={previews.selfie!} alt="Selfie" className="w-full h-96 object-cover" />
                    <button
                        onClick={() => {
                            removeFile('selfie');
                            setTimeout(startCamera, 300);
                        }}
                        className="absolute top-4 right-4 bg-black/70 hover:bg-black px-4 py-2 rounded-lg flex items-center gap-2 text-[12px] font-medium text-white transition-colors border border-[#1e2025]"
                    >
                        <RotateCcw className="w-4 h-4" /> Retake
                    </button>
                </div>
            )}

            {!files.selfie && (
                <label className="block text-center text-[12px] font-medium text-[#5a5f6e] hover:text-[#e8eaed] transition-colors cursor-pointer mt-2">
                    <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={(e) => handleFileChange('selfie', e.target.files?.[0] || null)}
                    />
                    Or choose from gallery
                </label>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
