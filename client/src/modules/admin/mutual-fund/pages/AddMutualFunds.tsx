'use client';

import { useState, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    X,
    Upload,
    Edit2,
    CheckCircle,
    Image,
    Loader2,
    AlertCircle,
} from 'lucide-react';

import {
    autoCategory,
    autoRisk,
    autoSubCategory,
    extractAMC,
    isValidFund,
} from '@utils/mutualFundUtils/mutual-fund-utilities';

import { addFundApi, type AddFundPayload } from '@shared/services/admin/mutual-fund-management/mutual-fund-admin-side';
import { GetSignatureApi } from '@shared/services/user/get-signature-api';
import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';

type MfScheme = {
    schemeCode: number;
    schemeName: string;
};

export default function AddMutualFundPage() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedScheme, setSelectedScheme] = useState<MfScheme | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [risk, setRisk] = useState('');
    const [isManualEdit, setIsManualEdit] = useState(false);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [submitError, setSubmitError] = useState<string | null>(null);

    const { data: allSchemes, isLoading, error } = useQuery({
        queryKey: ['mf-master'],
        queryFn: async () => {
            const res = await axios.get<MfScheme[]>('https://api.mfapi.in/mf');
            return res.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    const addFundMutation = useMutation({
        mutationFn: async () => {
            if (!selectedScheme) {
                throw new Error('Please select a scheme first');
            }

            const payload: AddFundPayload = {
                schemeCode: String(selectedScheme.schemeCode),
                schemeName: selectedScheme.schemeName,
                amc: extractAMC(selectedScheme.schemeName),
                category: category || autoCategory(selectedScheme.schemeName),
                subCategory: subCategory || autoSubCategory(selectedScheme.schemeName),
                risk: risk || autoRisk(subCategory || autoSubCategory(selectedScheme.schemeName)),
                logo: logoUrl || '',
            };

            const response = await addFundApi(payload);
            return response.data;
        },

        onSuccess: (data) => {
            toast.success(data?.message || 'Fund added successfully!');
            queryClient.invalidateQueries({ queryKey: ['mutual-funds'] });
            handleClearSelection();
            setSubmitError(null);
        },

        onError: (error: AxiosError<any>) => {
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
            const signatureData = await GetSignatureApi('fund-logo', String(selectedScheme?.schemeCode));
            const result = await uploadToCloudinary(file, signatureData.data);
            setLogoUrl(result.secure_url);
        } catch (err: any) {
            toast.error(err.message || 'Failed to upload logo');
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

    const toggleManualEdit = () => {
        setIsManualEdit((prev) => !prev);
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
        if (!searchQuery.trim()) return valid.slice(0, 100); // limit even when no query

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
        const sub = autoSubCategory(scheme.schemeName);
        setCategory(autoCategory(scheme.schemeName));
        setSubCategory(sub);
        setRisk(autoRisk(sub));
        setIsManualEdit(false);
        setSearchQuery('');
        setSubmitError(null);
    };

    const handleClearSelection = () => {
        setSelectedScheme(null);
        setCategory('');
        setSubCategory('');
        setRisk('');
        setLogoFile(null);
        setLogoPreview('');
        setLogoUrl('');
        setIsManualEdit(false);
        setSubmitError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={20} />
                    <p>Loading mutual fund schemes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
                    <p className="text-red-400">Failed to load schemes</p>
                    <p className="text-neutral-500 text-sm mt-2">Check your connection and try again</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-1 p-5 overflow-y-auto pb-24">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Plus size={20} className="text-emerald-400" />
                            </div>
                            Add New Mutual Fund
                        </h2>
                        <p className="text-sm text-neutral-400 mt-2">
                            Search and add verified growth/direct plans from official sources
                        </p>
                    </div>

                    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-8">
                        <label className="text-sm font-medium text-neutral-300 mb-2 block">
                            Search Scheme
                        </label>
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by fund name, e.g., HDFC Flexi Cap Growth Direct"
                                className="w-full pl-11 pr-12 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {searchQuery && (
                            <div className="mt-4 max-h-96 overflow-y-auto border border-neutral-800 rounded-lg bg-neutral-950">
                                {filteredSchemes.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-neutral-500">No schemes found matching your search</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-800">
                                        {filteredSchemes.map((scheme) => (
                                            <button
                                                key={scheme.schemeCode}
                                                onClick={() => handleSelectScheme(scheme)}
                                                className="w-full text-left px-5 py-4 hover:bg-neutral-800/70 transition-colors"
                                            >
                                                <p className="font-medium text-sm truncate">{scheme.schemeName}</p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    Scheme Code: {scheme.schemeCode}
                                                </p>
                                            </button>
                                        ))}
                                        {filteredSchemes.length === 50 && (
                                            <p className="text-center text-xs text-neutral-500 py-3">
                                                Showing first 50 results. Refine your search.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedScheme && (
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Selected Scheme</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={toggleManualEdit}
                                        className="text-sm text-neutral-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                                    >
                                        <Edit2 size={15} />
                                        {isManualEdit ? 'Lock Edits' : 'Edit Fields'}
                                    </button>
                                    <button
                                        onClick={handleClearSelection}
                                        className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5 transition-colors"
                                    >
                                        <X size={15} /> Clear
                                    </button>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <div>
                                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Scheme Code</label>
                                    <p className="mt-1.5 text-sm font-mono bg-neutral-800 px-4 py-3 rounded-lg">
                                        {selectedScheme.schemeCode}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-500 uppercase tracking-wider">AMC</label>
                                    <p className="mt-1.5 text-sm bg-neutral-800 px-4 py-3 rounded-lg capitalize">
                                        {amc || 'Not detected'}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs text-neutral-500 uppercase tracking-wider">Full Scheme Name</label>
                                <p className="mt-1.5 text-sm bg-neutral-800 px-4 py-3 rounded-lg break-words">
                                    {selectedScheme.schemeName}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {(['Category', 'Sub Category', 'Risk'] as const).map((label, i) => {
                                    const value = i === 0 ? category : i === 1 ? subCategory : risk;
                                    const setValue = i === 0 ? setCategory : i === 1 ? setSubCategory : setRisk;
                                    const options = i === 0
                                        ? ['Equity', 'Debt', 'Hybrid', 'Index']
                                        : i === 1
                                            ? ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index', 'Other']
                                            : ['Low', 'Medium', 'High'];

                                    return (
                                        <div key={label}>
                                            <label className="text-xs text-neutral-400 mb-1.5 block">{label}</label>
                                            <select
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                disabled={!isManualEdit}
                                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-emerald-500 focus:outline-none transition-colors"
                                            >
                                                <option value="">Auto-detected</option>
                                                {options.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mb-8">
                                <label className="text-sm font-medium flex items-center gap-2 mb-4">
                                    <Image size={18} className="text-emerald-400" />
                                    Fund Logo <span className="text-neutral-500 font-normal">(Optional)</span>
                                </label>

                                {logoPreview ? (
                                    <div className="relative max-w-xs mx-auto group">
                                        <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={logoPreview}
                                                alt="Fund logo preview"
                                                className="max-w-full max-h-full object-contain p-4"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={removeLogo}
                                                    className="bg-red-500 hover:bg-red-600 p-3 rounded-full transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-neutral-400 mt-3 truncate">
                                            {logoFile?.name}
                                        </p>
                                        <p className="text-center text-xs text-emerald-400">
                                            {(logoFile?.size && Math.round(logoFile.size / 1024)) || 0} KB
                                        </p>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="logo-upload"
                                        className="block border-2 border-dashed border-neutral-600 hover:border-emerald-500/70 rounded-xl p-10 text-center cursor-pointer transition-all group bg-neutral-800/30 hover:bg-neutral-800/50"
                                    >
                                        <Upload size={32} className="mx-auto text-neutral-500 group-hover:text-emerald-400 mb-4 transition-colors" />
                                        <p className="text-sm font-medium group-hover:text-white transition-colors">
                                            Click to upload logo
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-2">
                                            PNG, JPG, SVG • Max 1MB
                                        </p>
                                        <input
                                            id="logo-upload"
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                            onChange={handleLogoUpload}
                                            className="sr-only"
                                        />
                                    </label>
                                )}

                                {isUploading && (
                                    <div className="mt-4 flex items-center gap-3 text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-lg">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="text-sm">Uploading logo...</span>
                                    </div>
                                )}
                            </div>

                            {submitError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                                    <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-300">{submitError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleAddFund}
                                disabled={addFundMutation.isPending || isUploading}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/30"
                            >
                                {addFundMutation.isPending ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Adding Fund...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Add Fund to Database
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
