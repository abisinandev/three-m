import { useEffect, useState } from 'react';
import { Camera, CheckCircle, ArrowRight, ArrowLeft, MapPin, Loader2, User, AlertCircle } from 'lucide-react';
import api from '@/lib/axios-user';
import { GetSignatureApi } from '@shared/services/user/get-signature-api';
import { useUserStore } from '@stores/user/UserStore';
import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';
import { KYC_SUMBIT_URL } from '@shared/constants/userContants';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@shared/constants/routes';
import { KycDetailsForm } from '../components/KycDetailsForm';
import { KycAddressForm } from '../components/KycAddressForm';
import { KycDocumentUpload } from '../components/KycDocumentUpload';
import { KycSelfieCapture } from '../components/KycSelfieCapture';
import type { AddressData, DetailsData, KycFiles, KycPreviews, kycDocuments } from '@/shared/types/user/KycUserType';

const steps = [
    { id: 1, title: 'Your Details', field: 'details', isForm: true },
    { id: 2, title: 'Address Proof', field: 'address', isForm: true },
    { id: 3, title: 'PAN Card', field: 'pan' },
    { id: 4, title: 'Aadhar Card', field: 'aadhaar' },
    { id: 5, title: 'Live Selfie', field: 'selfie' },
];

const KYCVerificationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { user, setUser } = useUserStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const [files, setFiles] = useState<KycFiles>({
        pan: null,
        aadhaar: null,
        selfie: null,
    });

    const [previews, setPreviews] = useState<KycPreviews>({
        pan: null,
        aadhaar: null,
        selfie: null,
    });

    const [details, setDetails] = useState<DetailsData>({
        fullName: '',
        panNumber: '',
        aadharNumber: '',
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
        if (user?.kycStatus === 'verified' || user?.kycStatus === 'pending') {
            navigate({ to: ROUTES.USER.PROFILE });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user?.fullName) {
            setDetails(prev => ({ ...prev, fullName: user.fullName }));
        }
    }, [user]);


    useEffect(() => {
        const fetchLocationByPin = async () => {
            if (address.pincode.length === 6) {
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
                    const data = await response.json();
                    if (data && data[0].Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        setAddress(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }));
                        toast.success('City & State auto-filled!');
                    } else if (data && data[0].Status === 'Error') {
                        toast.error('Invalid PIN Code');
                    }
                } catch (_error) {
                    console.error('Error fetching location from PIN:', _error);
                }
            }
        };

        const timeoutId = setTimeout(() => fetchLocationByPin(), 500);
        return () => clearTimeout(timeoutId);
    }, [address.pincode]);

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

            const documents: kycDocuments[] = [];
            if (files.pan) documents.push({ type: 'pan', fileName: files.pan.name, fileUrl: uploadedFiles.pan || '' });
            if (files.aadhaar) documents.push({ type: 'aadhaar', fileName: files.aadhaar.name, fileUrl: uploadedFiles.aadhaar || '' });
            if (files.selfie) documents.push({ type: 'selfie', fileName: files.selfie.name, fileUrl: uploadedFiles.selfie || '' });

            await api.post(KYC_SUMBIT_URL, {
                userId: user?.id,
                fullName: details.fullName,
                panNumber: details.panNumber.toUpperCase(),
                aadharNumber: details.aadharNumber || null,
                address,
                documents,
            });

            if (user) {
                setUser({ ...user, kycStatus: 'pending' });
            }

            toast.success('KYC submitted successfully!');
            setSubmitStatus('success');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setTimeout(() => navigate({ to: ROUTES.USER.PROFILE }), 2000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <>
            <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center px-4 py-8 font-sans">
                <div className="w-full max-w-md">

                    {user?.kycStatus === 'rejected' && currentStep === 0 && (
                        <div className="mb-6 p-4 bg-[#F44336]/10 border border-[#F44336]/20 rounded-2xl shadow-[0_0_15px_rgba(244,67,54,0.1)]">
                            <h3 className="text-[#F44336] text-[13px] font-bold flex items-center gap-2 mb-1.5 tracking-tight uppercase">
                                <AlertCircle className="w-4 h-4" />
                                Previous KYC Rejected
                            </h3>
                            <p className="text-[#e8eaed] text-[12px] font-medium leading-relaxed opacity-90">
                                {user?.kyc?.rejectionReason || "Your previous submission didn't meet our guidelines. Please carefully re-enter your details and upload clear, readable documents."}
                            </p>
                        </div>
                    )}

                    {submitStatus === 'success' && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="text-center">
                                <CheckCircle className="w-24 h-24 text-[#00C853] mx-auto mb-4" />
                                <p className="text-[20px] font-semibold text-[#e8eaed] tracking-tight">KYC Submitted!</p>
                                <p className="text-[12px] text-[#5a5f6e] mt-2 font-medium">We'll review it within 24 hours</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate({ to: ROUTES.USER.PROFILE })}
                        className="mb-6 flex items-center gap-2 text-[#5a5f6e] hover:text-[#e8eaed] text-[12px] font-semibold transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-[18px] font-semibold text-[#e8eaed] tracking-tight">Complete KYC Verification</h2>
                        <p className="text-[12px] text-[#5a5f6e] font-medium mt-1">
                            Step {currentStep + 1} of {steps.length} • {step.title}
                        </p>
                    </div>

                    <div className="w-full h-1.5 bg-[#111214] rounded-full overflow-hidden mb-8 border border-[#1e2025]">
                        <div
                            className="h-full bg-gradient-to-r from-[#00C853] to-[#00E676] transition-all duration-500 shadow-[0_0_10px_rgba(0,200,83,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="bg-[#111214] rounded-2xl border border-[#1e2025] p-6 shadow-2xl">
                        <div className="space-y-6">

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0b0c0e] border border-[#1e2025] mb-4 shadow-inner">
                                    {step.isForm ? (
                                        step.field === 'details' ? (
                                            isDetailsComplete() ? <CheckCircle className="w-7 h-7 text-[#00C853]" /> : <User className="w-7 h-7 text-[#5a5f6e]" />
                                        ) : (
                                            isAddressComplete() ? <CheckCircle className="w-7 h-7 text-[#00C853]" /> : <MapPin className="w-7 h-7 text-[#5a5f6e]" />
                                        )
                                    ) : files[step.field as keyof typeof files] ? (
                                        <CheckCircle className="w-7 h-7 text-[#00C853]" />
                                    ) : (
                                        <Camera className="w-7 h-7 text-[#5a5f6e]" />
                                    )}
                                </div>
                                <h3 className="text-[14px] font-semibold text-[#e8eaed] tracking-tight">
                                    {step.field === 'details' ? 'Enter Your Details' : step.isForm ? 'Enter Address' : `Upload ${step.title}`}
                                </h3>
                            </div>

                            {step.field === 'selfie' ? (
                                <KycSelfieCapture
                                    files={files}
                                    previews={previews}
                                    handleFileChange={handleFileChange}
                                    removeFile={removeFile}
                                    isActive={step.field === 'selfie'}
                                />
                            ) : step.field === 'details' ? (
                                <KycDetailsForm
                                    details={details}
                                    setDetails={setDetails}
                                />
                            ) : step.field === 'address' ? (
                                <KycAddressForm
                                    address={address}
                                    setAddress={setAddress}
                                />
                            ) : (
                                <KycDocumentUpload
                                    field={step.field as 'pan' | 'aadhaar'}
                                    title={step.title}
                                    files={files}
                                    previews={previews}
                                    handleFileChange={handleFileChange}
                                    removeFile={removeFile}
                                />
                            )}

                            <div className="flex justify-between pt-6">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold tracking-tight transition-all ${currentStep === 0 ? 'text-[#3a3d45] cursor-not-allowed' : 'text-[#5a5f6e] hover:text-[#e8eaed] bg-[#111214] hover:bg-[#1a1b1e] border border-[#1e2025]'
                                        }`}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={currentStep === steps.length - 1 ? handleSubmit : goNext}
                                        disabled={!isStepComplete() || isSubmitting}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[12px] font-bold tracking-tight transition-all shadow-lg ${isStepComplete() && !isSubmitting
                                            ? 'bg-[#00C853] hover:bg-[#00E676] text-white shadow-green-500/10'
                                            : 'bg-[#111214] text-[#5a5f6e] cursor-not-allowed border border-[#1e2025]'
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

                </div>
            </div>
        </>
    );
};

export default KYCVerificationPage;


