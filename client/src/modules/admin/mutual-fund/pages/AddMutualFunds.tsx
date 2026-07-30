'use client';
import { useState, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Plus,
    Search,
    X,
    Upload,
    CheckCircle,
    Image,
    Loader2,
    AlertCircle,
    Building2,
    Briefcase,
    ShieldAlert
} from 'lucide-react';

import {
    autoCategory,
    autoRisk,
    autoSubCategory,
    extractAMC,
    isValidFund,
} from '@utils/mutualFundUtils/mutual-fund-utilities';

import { addFundApi, } from '@shared/services/admin/mutual-fund-management/mutual-fund-admin-side';
import { GetSignatureApi } from '@shared/services/user/get-signature-api';
import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';
import { useAdminStore } from '@/stores/admin/useAdminStore';
import type { AddFundPayload, MfScheme } from '@/shared/types/admin/mutual-fund-management.types';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/shared/constants/apiRoutes';

export default function AddMutualFundPage() {
    const navigate = useNavigate();
    const adminId = useAdminStore(state => state.data?.adminCode || 'admin');
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedScheme, setSelectedScheme] = useState<MfScheme | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [submitError, setSubmitError] = useState<string | null>(null);

    const { data: allSchemes, isLoading, error } = useQuery({
        queryKey: ['mf-master'],
        queryFn: async () => {
            const url = import.meta.env.VITE_MF_API_URL;
            if (!url) {
                const configError = new Error(
                    'Mutual fund API URL is not configured. Please contact the system administrator.'
                );
                configError.name = 'ConfigurationError';
                throw configError;
            }
            const res = await axios.get<MfScheme[]>(url);
            return res.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    const addFundMutation = useMutation({
        mutationFn: async () => {
            if (!selectedScheme) {
                return null;
            }

            const payload: AddFundPayload = {
                schemeCode: String(selectedScheme.schemeCode),
                schemeName: selectedScheme.schemeName,
                amc: extractAMC(selectedScheme.schemeName),
                category: autoCategory(selectedScheme.schemeName),
                subCategory: autoSubCategory(selectedScheme.schemeName),
                risk: autoRisk(autoSubCategory(selectedScheme.schemeName)),
                logo: logoUrl || '',
            };

            const response = await addFundApi(payload) as { data: { message?: string } };
            return response.data;
        },

        onSuccess: (data) => {
            toast.success(data?.message || 'Fund added successfully!');
            queryClient.invalidateQueries({ queryKey: ['mutual-funds'] });
            handleClearSelection();
            setSubmitError(null);
        },

        onError: (error: AxiosError<{ message?: string }>) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Failed to add fund. Please try again.';
            setSubmitError(message);
            if (!error.response?.data?.message) {
                toast.error('Something went wrong while adding the fund');
            }
        },
    });

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only PNG, JPG, or SVG allowed.');
            return;
        }

        if (file.size > 1024 * 1024) {
            toast.error('File too large. Maximum size is 1MB.');
            return;
        }

        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);
        setSubmitError(null);

        try {
            const signatureData = await GetSignatureApi('fund-logo');
            const result = await uploadToCloudinary(file, signatureData.data);
            setLogoUrl(result.secure_url);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || 'Failed to upload logo');
            removeLogo();
        } finally {
            setIsUploading(false);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        setLogoUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddFund = () => {
        setSubmitError(null);

        if (isUploading) {
            setSubmitError('Please wait for logo upload to complete');
            return;
        }

        if (!selectedScheme) {
            setSubmitError('Please select a mutual fund scheme');
            return;
        }

        addFundMutation.mutate();
    };

    const filteredSchemes = useMemo(() => {
        if (!allSchemes) return [];
        const valid = allSchemes.filter((f) => isValidFund(f.schemeName));
        if (!searchQuery.trim()) return valid.slice(0, 100);

        const lowerQuery = searchQuery.toLowerCase();
        return valid
            .filter((scheme) =>
                scheme.schemeName.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 50);
    }, [allSchemes, searchQuery]);

    const amc = useMemo(() => {
        if (!selectedScheme) return '';
        return extractAMC(selectedScheme.schemeName);
    }, [selectedScheme]);

    const handleSelectScheme = (scheme: MfScheme) => {
        setSelectedScheme(scheme);
        setSearchQuery('');
        setSubmitError(null);
    };

    const handleClearSelection = () => {
        setSelectedScheme(null);
        setLogoFile(null);
        setLogoPreview('');
        setLogoUrl('');
        setSubmitError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-[#0b0c0e] text-white flex items-center justify-center min-h-[500px]">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-emerald-500" size={20} />
                    <p className="text-sm text-neutral-400">Loading master list...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 bg-[#0b0c0e] text-white flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <AlertCircle size={24} className="mx-auto text-red-500 mb-2" />
                    <p className="text-sm text-red-400">Failed to load schemes</p>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['mf-master'] })} className="text-xs text-emerald-500 mt-2 hover:underline">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                minHeight: '100vh',
                background: '#0b0c0e',
                color: '#e8eaed',
                paddingBottom: 40
            }}
        >
            <main className="px-6 pt-6 max-w-[1200px] mx-auto space-y-6">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate({ to: ROUTES.ADMIN.MUTUAL_FUNDS_MANAGEMENT.ROOT })}
                            className="p-1.5 rounded-lg border border-[#1e2025] bg-[#111214] hover:bg-[#1a1c20] hover:border-[#2a2d35] text-[#5a5f6e] hover:text-white transition-all"
                            title="Go back"
                        >
                            <ArrowLeft size={15} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
                                Onboard Mutual Funds
                            </h1>
                            <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
                                Search and verify growth/direct plans for the platform
                            </p>
                        </div>
                    </div>

                    <div style={{ fontSize: 10, color: '#5a5f6e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Admin Console / Mutual Funds
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-5 shadow-sm">
                        <label className="text-xs font-semibold text-[#e8eaed] mb-2 block">
                            Search Scheme
                        </label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g. HDFC Flexi Cap Growth Direct"
                                className="w-full pl-9 pr-8 py-2.5 bg-[#0b0c0e] border border-[#1e2025] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-[#5a5f6e]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5f6e] hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {searchQuery && (
                            <div className="mt-3 max-h-[300px] overflow-y-auto border border-[#1e2025] rounded-lg bg-[#0b0c0e] custom-scrollbar">
                                {filteredSchemes.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <p className="text-xs text-[#5a5f6e]">No schemes found matching your search</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#1e2025]">
                                        {filteredSchemes.map((scheme) => (
                                            <button
                                                key={scheme.schemeCode}
                                                onClick={() => handleSelectScheme(scheme)}
                                                className="w-full text-left px-4 py-3 hover:bg-[#141518] transition-colors flex items-center justify-between group"
                                            >
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-xs text-[#e8eaed] truncate pr-4">{scheme.schemeName}</p>
                                                    <p className="text-[10px] text-[#5a5f6e] mt-0.5">
                                                        Code: {scheme.schemeCode}
                                                    </p>
                                                </div>
                                                <Plus size={14} className="text-[#5a5f6e] group-hover:text-emerald-500 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!searchQuery && !selectedScheme && (
                            <div className="mt-4 flex flex-col items-center justify-center p-8 border border-dashed border-[#1e2025] rounded-lg bg-[#0b0c0e]">
                                <Search size={24} className="text-[#1e2025] mb-2" />
                                <p className="text-xs text-[#5a5f6e]">Search to select a scheme</p>
                            </div>
                        )}
                    </div>

                    {selectedScheme ? (
                        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e2025]">
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Asset Verification</h3>
                                    <p className="text-[10px] text-[#5a5f6e]">Data is read-only and automatically mapped.</p>
                                </div>
                                <button
                                    onClick={handleClearSelection}
                                    className="p-1.5 hover:bg-[#1e2025] rounded-md transition-colors text-[#5a5f6e] hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-[10px] text-[#5a5f6e] uppercase tracking-wider font-bold mb-1 block">Full Scheme Name</label>
                                    <div className="text-xs bg-[#0b0c0e] border border-[#1e2025] px-3 py-2 rounded-lg break-words text-[#e8eaed]">
                                        {selectedScheme.schemeName}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-[#5a5f6e] uppercase tracking-wider font-bold mb-1 block">Scheme Code</label>
                                        <div className="text-xs font-mono bg-[#0b0c0e] border border-[#1e2025] px-3 py-2 rounded-lg text-[#e8eaed]">
                                            {selectedScheme.schemeCode}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-[#5a5f6e] uppercase tracking-wider font-bold mb-1 block">AMC</label>
                                        <div className="text-xs bg-[#0b0c0e] border border-[#1e2025] px-3 py-2 rounded-lg capitalize text-[#e8eaed]">
                                            {amc || 'Not detected'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <Building2 size={14} className="text-emerald-500/70 mb-1" />
                                        <span className="text-[10px] text-[#5a5f6e] font-medium uppercase mb-0.5">Category</span>
                                        <span className="text-xs font-semibold text-white">{autoCategory(selectedScheme.schemeName)}</span>
                                    </div>
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <Briefcase size={14} className="text-emerald-500/70 mb-1" />
                                        <span className="text-[10px] text-[#5a5f6e] font-medium uppercase mb-0.5">Sub Category</span>
                                        <span className="text-xs font-semibold text-white">{autoSubCategory(selectedScheme.schemeName)}</span>
                                    </div>
                                    <div className="bg-[#0b0c0e] border border-[#1e2025] p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                        <ShieldAlert size={14} className="text-emerald-500/70 mb-1" />
                                        <span className="text-[10px] text-[#5a5f6e] font-medium uppercase mb-0.5">Risk</span>
                                        <span className="text-xs font-semibold text-white">{autoRisk(autoSubCategory(selectedScheme.schemeName))}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 pt-4 border-t border-[#1e2025]">
                                <label className="text-[11px] font-semibold flex items-center gap-2 mb-3 text-white">
                                    <Image size={14} className="text-emerald-500" />
                                    Fund Logo <span className="text-[#5a5f6e] font-normal">(Optional)</span>
                                </label>

                                {logoPreview ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-[#0b0c0e] rounded-xl border border-[#1e2025] flex items-center justify-center overflow-hidden relative group">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={removeLogo}>
                                                <X size={16} className="text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#e8eaed] truncate max-w-[150px]">{logoFile?.name}</p>
                                            <p className="text-[10px] text-emerald-500">{(logoFile?.size && Math.round(logoFile.size / 1024)) || 0} KB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <label
                                            htmlFor="logo-upload"
                                            className="px-4 py-2 bg-[#0b0c0e] border border-[#1e2025] hover:border-emerald-500/30 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-2 text-[#e8eaed] hover:text-white"
                                        >
                                            <Upload size={14} />
                                            Upload Logo
                                            <input
                                                id="logo-upload"
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                onChange={handleLogoUpload}
                                                className="sr-only"
                                            />
                                        </label>
                                        <span className="text-[10px] text-[#5a5f6e]">Max 1MB (PNG, JPG, SVG)</span>
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="mt-3 flex items-center gap-2 text-emerald-500 text-xs">
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Uploading...</span>
                                    </div>
                                )}
                            </div>

                            {submitError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-400">{submitError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleAddFund}
                                disabled={addFundMutation.isPending || isUploading}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:scale-100 active:scale-[0.98] rounded-lg text-xs font-bold text-white transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            >
                                {addFundMutation.isPending ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Adding Fund...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={14} />
                                        Onboard Fund
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="hidden lg:flex bg-[#111214] border border-[#1e2025] rounded-xl p-8 items-center justify-center shadow-sm">
                            <div className="text-center space-y-3 opacity-50">
                                <ShieldAlert size={32} className="mx-auto text-[#5a5f6e]" />
                                <div>
                                    <p className="text-sm font-medium text-white">No Selection</p>
                                    <p className="text-xs text-[#5a5f6e] mt-1 max-w-[200px] mx-auto">
                                        Select a scheme from the list to view its verified details and onboard it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e2025;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

