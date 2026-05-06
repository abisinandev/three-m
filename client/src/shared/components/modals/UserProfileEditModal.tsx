import { X, CheckCircle, Send, Loader2 } from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useUserStore } from '@stores/user/UserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileApi, SendEmailOtpApi, VerifyEmailOtpApi } from '@shared/services/user/update-profile-api';
import { toast } from 'sonner';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user } = useUserStore();
    const queryClient = useQueryClient();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail] = useState(user?.email || '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEmailChanged, setIsEmailChanged] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const isKycLocked = user?.kycStatus === 'VERIFIED' || user?.kycStatus === 'PENDING';

    useEffect(() => {
        if (isOpen && user) {
            setFullName(user.fullName || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
            setIsEmailChanged(false);
            setShowOtpField(false);
            setOtp('');
            setIsEmailVerified(false);
            setErrors({});
        }
    }, [isOpen, user]);

    useEffect(() => {
        const changed = email.trim() !== originalEmail.trim();
        setIsEmailChanged(changed);
        if (!changed) {
            setShowOtpField(false);
            setIsEmailVerified(false);
        }
    }, [email, originalEmail]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) newErrors.fullName = 'Name is required';
        else if (fullName.trim().length < 2) newErrors.fullName = 'Name too short';

        if (phone && !/^\d{10}$/.test(phone)) newErrors.phone = 'Invalid phone number';

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';

        if (isEmailChanged && !isEmailVerified) newErrors.email = 'Verify your new email';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendOtpMutation = useMutation({
        mutationFn: () => SendEmailOtpApi({ email: email.trim() }),
        onSuccess: () => setShowOtpField(true),
        onError: () => setErrors(prev => ({ ...prev, email: 'Failed to send OTP' })),
    });

    const verifyOtpMutation = useMutation({
        mutationFn: () => VerifyEmailOtpApi({ email: email.trim(), otp }),
        onSuccess: () => {
            setIsEmailVerified(true);
            setShowOtpField(false);
            setOtp('');
        },
        onError: () => setErrors(prev => ({ ...prev, otp: 'Invalid or expired OTP' })),
    });

    const updateProfileMutation = useMutation({
        mutationFn: () =>
            UpdateProfileApi({
                fullName: fullName.trim(),
                phone: phone || undefined,
                email: isEmailChanged ? email.trim() : undefined,
            }),

        onSuccess: (res) => {
            toast.success(res.message || "Profile updated")
            queryClient.invalidateQueries({ queryKey: ['user'] });
            onClose();
        },

        onError: () => {
            setErrors(prev => ({ ...prev, submit: 'Failed to update profile' }));
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate() || !user) return;
        updateProfileMutation.mutate();
    };

    if (!isOpen) return null;

    const isKycVerified = user?.kycStatus === 'verified';
    const maskedAadhar = user?.aadharNumber
        ? `XXXX-XXXX-${user.aadharNumber.slice(-4)}`
        : 'Not added';

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[380px] rounded-2xl bg-[#0b0c0e] border border-[#1e2025] shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10b981]" />

                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2025] sticky top-0 bg-[#0b0c0e] z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-[14px] font-semibold text-[#e8eaed] tracking-tight">Edit Profile</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div>
                        <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            disabled={isKycLocked}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`w-full px-3 py-2.5 bg-[#111214] border border-[#1e2025] rounded-xl text-[13px] placeholder-[#333] focus:outline-none ${isKycLocked ? 'text-[#5a5f6e] cursor-not-allowed opacity-70' : 'text-white focus:border-[#00C853]/50'} font-medium transition-all`}
                            placeholder="Enter full name"
                        />
                        {isKycLocked ? (
                            <p className="text-[#f59e0b] text-[9px] font-bold mt-1.5 uppercase tracking-tight">Name locked during KYC verification</p>
                        ) : errors.fullName ? (
                            <p className="text-red-500 text-[9px] font-bold mt-1 uppercase tracking-tight">{errors.fullName}</p>
                        ) : null}
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2">Phone Number</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-[#5a5f6e] bg-[#111214] border border-r-0 border-[#1e2025] rounded-l-xl text-[11px] font-semibold">+91</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                className="w-full px-3 py-2.5 bg-[#111214] border border-[#1e2025] rounded-r-xl text-white text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium tracking-wider"
                                placeholder="10-digit mobile"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase tracking-tight">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 bg-[#111214] border border-[#1e2025] rounded-xl text-white text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-[9px] font-bold mt-1 uppercase tracking-tight">{errors.email}</p>}

                        {isEmailChanged && !isEmailVerified && !showOtpField && (
                            <button
                                type="button"
                                onClick={() => sendOtpMutation.mutate()}
                                disabled={sendOtpMutation.isPending}
                                className="mt-2.5 flex items-center gap-2 text-[10px] font-black text-[#00C853] hover:text-[#00E676] uppercase tracking-widest"
                            >
                                <Send className="w-3 h-3" />
                                {sendOtpMutation.isPending ? 'Sending OTP...' : 'Verify Email'}
                            </button>
                        )}

                        {showOtpField && (
                            <div className="mt-3 space-y-3 animate-in fade-in duration-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        placeholder="OTP"
                                        className="flex-1 px-3 py-2 bg-[#111214] border border-[#1e2025] rounded-xl text-white text-[12px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-black tracking-[0.3em] text-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => verifyOtpMutation.mutate()}
                                        disabled={verifyOtpMutation.isPending || otp.length !== 6}
                                        className="px-4 py-2 bg-[#00C853] hover:bg-[#00E676] disabled:opacity-30 text-black text-[10px] font-black rounded-xl transition uppercase tracking-widest"
                                    >
                                        {verifyOtpMutation.isPending ? '...' : 'Verify'}
                                    </button>
                                </div>
                                {errors.otp && <p className="text-red-500 text-[9px] font-bold uppercase tracking-tight">{errors.otp}</p>}
                            </div>
                        )}

                        {isEmailVerified && (
                            <div className="mt-2.5 flex items-center gap-1.5 text-[#00C853] text-[11px] font-semibold uppercase tracking-wider">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Verified
                            </div>
                        )}
                    </div>

                    {isKycVerified && (
                        <div className="pt-5 border-t border-[#1e2025] space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-widest">PAN Card</span>
                                <span className="text-white text-[11px] font-black flex items-center gap-1.5 tracking-wider">
                                    {user?.panNumber}
                                    <CheckCircle className="w-3 h-3 text-[#00C853]" />
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-widest">Aadhar</span>
                                <span className="text-white text-[11px] font-black flex items-center gap-1.5 tracking-wider">
                                    {maskedAadhar}
                                    <CheckCircle className="w-3 h-3 text-[#00C853]" />
                                </span>
                            </div>
                            <p className="text-[9px] text-[#5a5f6e] font-bold uppercase tracking-tight text-center bg-[#111214] py-2 rounded-lg">KYC Verified • Read-Only</p>
                        </div>
                    )}

                    {errors.submit && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{errors.submit}</p>}

                    <div className="flex gap-3 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-[#111214] hover:bg-[#1a1b1e] text-[#5a5f6e] hover:text-[#e8eaed] text-[12px] font-semibold tracking-tight rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending || (isEmailChanged && !isEmailVerified)}
                            className="flex-1 px-4 py-3 bg-[#00C853] hover:bg-[#00E676] disabled:opacity-30 text-black text-[12px] font-bold tracking-tight rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
