import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, X, Loader2 } from 'lucide-react';
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-[340px] bg-[#0b0c0e] border border-[#1e2025] rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2025]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                        <span className="text-[14px] font-semibold text-[#e8eaed] tracking-tight">Update Security</span>
                    </div>
                    <button onClick={onClose} className="text-[#5a5f6e] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-3">
                            <div className="relative">
                                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-1 ml-1">Current Password</label>
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 bg-[#111214] border border-[#1e2025] rounded-xl text-white placeholder-[#222] text-[13px] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3.5 top-[32px] text-[#3a3d45] hover:text-white transition-colors"
                                >
                                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-1 ml-1">New Password</label>
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 bg-[#111214] border border-[#1e2025] rounded-xl text-white placeholder-[#222] text-[13px] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3.5 top-[32px] text-[#3a3d45] hover:text-white transition-colors"
                                >
                                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-1 ml-1">Confirm New Password</label>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 bg-[#111214] border border-[#1e2025] rounded-xl text-white placeholder-[#222] text-[13px] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-[32px] text-[#3a3d45] hover:text-white transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="p-2.5 bg-[#111214] rounded-xl border border-[#1e2025] space-y-1">
                            <p className="text-[10px] font-semibold text-[#5a5f6e] uppercase tracking-wider mb-1">Password Strength</p>
                            {[
                                { text: '8+ Characters', met: requirements.length },
                                { text: 'Uppercase Letter', met: requirements.uppercase },
                                { text: 'Lowercase Letter', met: requirements.lowercase },
                                { text: 'Number included', met: requirements.number },
                                { text: 'Special Symbol', met: requirements.special },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full border ${rule.met ? 'bg-[#00C853] border-[#00C853]' : 'border-[#1e2025]'}`}>
                                        {rule.met && <div className="w-1 h-1 bg-black rounded-full m-auto mt-0.5" />}
                                    </div>
                                    <span className={`text-[10px] font-medium tracking-tight ${rule.met ? 'text-[#e8eaed]' : 'text-[#3a3d45]'}`}>{rule.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2.5 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-[#5a5f6e] font-medium leading-relaxed">
                                Note: This will log you out from all other active sessions.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <button
                                type="submit"
                                disabled={changePasswordMutation.isPending}
                                className="w-full py-2.5 bg-[#00C853] hover:bg-[#00E676] disabled:opacity-30 text-white text-[12px] font-bold tracking-tight rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                            >
                                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-2 text-[12px] font-medium text-[#5a5f6e] hover:text-white transition-colors tracking-tight"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}