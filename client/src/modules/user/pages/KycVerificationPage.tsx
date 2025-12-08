import { useEffect, useRef, useState } from 'react';
import { Camera, Upload, CheckCircle, ArrowRight, ArrowLeft, MapPin, Loader2, User, X, FileText, RotateCcw } from 'lucide-react';
import api from '@lib/axiosUser';
import { GetSignatureApi } from '@shared/services/user/GetSignatureApi';
import { useUserStore } from '@stores/user/UserStore';
import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';
import { KYC_SUMBIT_URL } from '@shared/constants/userContants';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const steps = [
    { id: 1, title: 'Your Details', field: 'details', isForm: true },
    { id: 2, title: 'Address Proof', field: 'address', isForm: true },
    { id: 3, title: 'PAN Card', field: 'pan' },
    { id: 4, title: 'Aadhaar Card', field: 'aadhaar' },
    { id: 5, title: 'Live Selfie', field: 'selfie' },
];

interface DetailsData {
    fullName: string;
    panNumber: string;
    aadhaarNumber: string;
}

interface AddressData {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
}

const KYCVerificationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useUserStore();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const [files, setFiles] = useState({
        pan: null as File | null,
        aadhaar: null as File | null,
        selfie: null as File | null,
    });

    const [previews, setPreviews] = useState({
        pan: null as string | null,
        aadhaar: null as string | null,
        selfie: null as string | null,
    });

    const [details, setDetails] = useState<DetailsData>({
        fullName: '',
        panNumber: '',
        aadhaarNumber: '',
    });

    const [address, setAddress] = useState<AddressData>({
        fullAddress: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const step = steps[currentStep];

    useEffect(() => {
        if (user?.fullName) {
            setDetails(prev => ({ ...prev, fullName: user.fullName }));
        }
    }, [user]);

    const handleFileChange = (field: 'pan' | 'aadhaar' | 'selfie', file: File | null) => {
        if (!file) {
            setFiles(prev => ({ ...prev, [field]: null }));
            setPreviews(prev => ({ ...prev, [field]: null }));
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, PNG or PDF allowed');
            return;
        }

        if (file.size > maxSize) {
            toast.error('File must be under 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);

        setFiles(prev => ({ ...prev, [field]: file }));
    };

    const removeFile = (field: 'pan' | 'aadhaar' | 'selfie') => {
        setFiles(prev => ({ ...prev, [field]: null }));
        setPreviews(prev => ({ ...prev, [field]: null }));
    };

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
        if (step.field === 'selfie' && !files.selfie) {
            startCamera();
        }
        return () => {
            if (step.field !== 'selfie') stopCamera();
        };
    }, [currentStep, files.selfie]);

    const isDetailsComplete = () => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return details.fullName.trim().length >= 3 && panRegex.test(details.panNumber.toUpperCase());
    };

    const isAddressComplete = () => {
        return (
            address.fullAddress.trim().length > 10 &&
            address.city.trim().length > 2 &&
            address.state.trim().length > 2 &&
            /^\d{6}$/.test(address.pincode)
        );
    };

    const isStepComplete = () => {
        if (step.field === 'details') return isDetailsComplete();
        if (step.field === 'address') return isAddressComplete();
        return !!files[step.field as keyof typeof files];
    };

    const goNext = () => {
        if (isStepComplete() && currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const uploadedFiles: Record<string, string> = {};

            for (const key of ['pan', 'aadhaar', 'selfie'] as const) {
                const file = files[key];
                if (file) {
                    const signatureData = await GetSignatureApi('kyc', user?.id as string);
                    const uploaded = await uploadToCloudinary(file, signatureData.data);
                    uploadedFiles[key] = uploaded.secure_url;
                }
            }

            const documents = [];
            if (files.pan) documents.push({ type: 'pan', fileName: files.pan.name, fileUrl: uploadedFiles.pan });
            if (files.aadhaar) documents.push({ type: 'aadhaar', fileName: files.aadhaar.name, fileUrl: uploadedFiles.aadhaar });
            if (files.selfie) documents.push({ type: 'selfie', fileName: files.selfie.name, fileUrl: uploadedFiles.selfie });

            await api.post(KYC_SUMBIT_URL, {
                userId: user?.id,
                fullName: details.fullName,
                panNumber: details.panNumber.toUpperCase(),
                aadhaarNumber: details.aadhaarNumber || null,
                address,
                documents,
            });

            toast.success('KYC submitted successfully!');
            setSubmitStatus('success');
            setTimeout(() => navigate({ to: '/user/profile' }), 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <>
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">

                    {submitStatus === 'success' && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="text-center">
                                <CheckCircle className="w-24 h-24 text-[#22C55E] mx-auto mb-4" />
                                <p className="text-2xl font-bold text-white">KYC Submitted!</p>
                                <p className="text-gray-400 mt-2">We'll review it within 24 hours</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-white">Complete KYC Verification</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Step {currentStep + 1} of {steps.length} • {step.title}
                        </p>
                    </div>

                    <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-8">
                        <div
                            className="h-full bg-gradient-to-r from-[#22C55E] to-[#16a34a] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f] p-6 shadow-2xl">
                        <div className="space-y-6">

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111111] border border-[#333] mb-4">
                                    {step.isForm ? (
                                        step.field === 'details' ? (
                                            isDetailsComplete() ? <CheckCircle className="w-8 h-8 text-[#22C55E]" /> : <User className="w-8 h-8 text-gray-500" />
                                        ) : (
                                            isAddressComplete() ? <CheckCircle className="w-8 h-8 text-[#22C55E]" /> : <MapPin className="w-8 h-8 text-gray-500" />
                                        )
                                    ) : files[step.field as keyof typeof files] ? (
                                        <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <h3 className="text-base font-medium text-white">
                                    {step.field === 'details' ? 'Enter Your Details' : step.isForm ? 'Enter Address' : `Upload ${step.title}`}
                                </h3>
                            </div>

                            {step.field === 'selfie' ? (
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
                                                    className="w-20 h-20 bg-white rounded-full shadow-2xl ring-4 ring-gray-900/50"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-[#333]">
                                            <img src={previews.selfie!} alt="Selfie" className="w-full h-96 object-cover" />
                                            <button
                                                onClick={() => {
                                                    removeFile('selfie');
                                                    setTimeout(startCamera, 300);
                                                }}
                                                className="absolute top-4 right-4 bg-black/70 hover:bg-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                                            >
                                                <RotateCcw className="w-4 h-4" /> Retake
                                            </button>
                                        </div>
                                    )}

                                    {!files.selfie && (
                                        <label className="block text-center text-xs text-gray-500 hover:text-gray-300 cursor-pointer">
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
                                </div>
                            ) : step.field === 'details' ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name (as on PAN)"
                                        value={details.fullName}
                                        readOnly
                                        className="w-full px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 opacity-70 cursor-not-allowed"
                                    />
                                    <input
                                        type="text"
                                        placeholder="PAN Number (e.g. ABCDE1234F)"
                                        value={details.panNumber}
                                        onChange={(e) => setDetails(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0, 10) }))}
                                        className="w-full px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none font-mono tracking-widest"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Aadhaar Number"
                                        value={details.aadhaarNumber}
                                        onChange={(e) => setDetails(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                                        className="w-full px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none font-mono"
                                    />
                                </div>
                            ) : step.field === 'address' ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Full Address"
                                        value={address.fullAddress}
                                        onChange={(e) => setAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                                        className="w-full px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={address.city}
                                            onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                                            className="px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={address.state}
                                            onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                                            className="px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="PIN Code"
                                        value={address.pincode}
                                        maxLength={6}
                                        onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                                        className="w-full px-4 py-3 bg-[#111111] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#22C55E] outline-none"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    {previews[step.field as keyof typeof previews] ? (
                                        <div className="relative rounded-xl overflow-hidden border border-[#333]">
                                            {files[step.field as keyof typeof files]?.type === 'application/pdf' ? (
                                                <div className="bg-gray-800 h-64 flex flex-col items-center justify-center">
                                                    <FileText className="w-16 h-16 text-gray-400" />
                                                    <p className="text-xs text-gray-400 mt-2">PDF Document</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={previews[step.field as keyof typeof previews]!}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover"
                                                />
                                            )}
                                            <button
                                                onClick={() => removeFile(step.field as any)}
                                                className="absolute top-3 right-3 bg-black/70 hover:bg-black p-2 rounded-full"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`upload-${step.field}`}
                                            className="block border-2 border-dashed border-[#333] hover:border-[#444] rounded-xl p-12 text-center cursor-pointer transition bg-[#111111]"
                                        >
                                            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                            <p className="text-xs text-gray-400">Click to upload • Max 5MB</p>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF</p>
                                        </label>
                                    )}
                                    <input
                                        id={`upload-${step.field}`}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(step.field as any, e.target.files?.[0] || null)}
                                    />
                                </div>
                            )}

                            <div className="flex justify-between pt-6">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${currentStep === 0 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={currentStep === steps.length - 1 ? handleSubmit : goNext}
                                        disabled={!isStepComplete() || isSubmitting}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${isStepComplete() && !isSubmitting
                                                ? 'bg-[#22C55E] hover:bg-[#1ea853] text-white'
                                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>Submitting... <Loader2 className="w-4 h-4 animate-spin" /></>
                                        ) : currentStep === steps.length - 1 ? (
                                            'Submit KYC'
                                        ) : (
                                            <>Next <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </>
    );
};

export default KYCVerificationPage;