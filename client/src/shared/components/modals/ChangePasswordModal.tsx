import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ChangePasswordApi } from '@shared/services/user/ChangePasswordApi';
import type { AxiosError } from 'axios';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });


    useEffect(() => {
        if (newPassword) {
            setRequirements({
                length: newPassword.length >= 8,
                uppercase: /[A-Z]/.test(newPassword),
                lowercase: /[a-z]/.test(newPassword),
                number: /\d/.test(newPassword),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
            });
        }
    }, [newPassword]);

    const changePasswordMutation = useMutation({
        mutationFn: async () => await ChangePasswordApi(
            {
                currentPassword,
                newPassword,
                confirmPassword
            }
        ),
        onSuccess: (res) => {
            toast.success(res.data?.message);
            onClose();
        },
        onError: (err: AxiosError<{ message: string }>) => {
            console.log('=', err?.response?.data?.message)
            console.log('===',err)
            toast.error(err?.response?.data?.message || "Change password failed");

        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (Object.values(requirements).includes(false)) {
            toast.error('Password too weak');
            return;
        }

        changePasswordMutation.mutate();

    };

    if (!isOpen) return null;

    return (
        <>
    
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                onClick={onClose}
            />

 
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-sm bg-[#0f0f0f] rounded-2xl border border-[#222] shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                >
                    <div className="p-6 space-y-5">

                        {/* Header */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Change Password</h3>
                            <p className="text-gray-500 text-xs mt-1">Secure your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

 
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Current password"
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22C55E] pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

             
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22C55E] pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

     
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22C55E] pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

         
                            <div className="text-xs space-y-1.5 p-3 bg-[#1A1A1A] rounded-lg border border-[#333]">
                                {[
                                    { text: '8+ characters', met: requirements.length },
                                    { text: 'One uppercase', met: requirements.uppercase },
                                    { text: 'One lowercase', met: requirements.lowercase },
                                    { text: 'One number', met: requirements.number },
                                    { text: 'One special char', met: requirements.special },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className={`w-3.5 h-3.5 rounded-full border ${rule.met ? 'bg-[#22C55E] border-[#22C55E]' : 'border-gray-600'}`}>
                                            {rule.met && <div className="w-1.5 h-1.5 bg-black rounded-full m-auto mt-0.5" />}
                                        </div>
                                        <span className={rule.met ? 'text-gray-400' : 'text-gray-600'}>{rule.text}</span>
                                    </div>
                                ))}
                            </div>

   
                            <div className="flex gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs">
                                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <p className="text-gray-300">
                                    <span className="text-blue-400 font-medium">Note:</span> You’ll be logged out from all devices.
                                </p>
                            </div>

   
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#22C55E] hover:bg-[#1ea853] text-white font-bold text-sm py-3 rounded-xl transition"
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] text-white text-sm font-medium py-3 rounded-xl border border-[#333] transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}