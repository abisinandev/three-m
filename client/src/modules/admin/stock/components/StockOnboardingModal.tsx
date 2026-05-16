import { useState, useEffect, useRef, useCallback, type FC } from 'react';
import { X, Search, Plus, Check, Loader2, Globe, Landmark, Upload, ArrowLeft, Building2 } from 'lucide-react';
import { StockManagementApi } from '../services/StockManagementApi';
import { uploadToCloudinary } from '@/utils/upload/UploadToCloudinary';
import { GetSignatureApi } from '@/shared/services/user/get-signature-api';
import { useAdminStore } from '@/stores/admin/useAdminStore';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

interface StockOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

import type { StockResult } from '@/shared/types/admin/stock-management.types';

type Step = 'search' | 'details';

export const StockOnboardingModal: FC<StockOnboardingModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const adminId = useAdminStore(state => state.data?.adminCode || 'admin');
    const [step, setStep] = useState<Step>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<StockResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedStock, setSelectedStock] = useState<StockResult | null>(null);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sector, setSector] = useState('Unknown');

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = useCallback(async () => {
        setIsSearching(true);
        try {
            const data = await StockManagementApi.searchStocks(searchQuery);
            setResults(data);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search stocks');
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(handleSearch, 500);
        } else {
            setResults([]);
        }
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery, handleSearch]);

    const handleSelectStock = (stock: StockResult) => {
        setSelectedStock(stock);
        setStep('details');
    };

    const handleBack = () => {
        setStep('search');
        setSelectedStock(null);
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOnboard = async () => {
        if (!selectedStock) return;

        setIsSubmitting(true);
        try {
            let logoUrl = null;

            if (logoFile && adminId) {
                const signatureData = await GetSignatureApi(adminId, 'stock_logos');
                const uploadRes = await uploadToCloudinary(logoFile, signatureData.data);
                logoUrl = uploadRes.secure_url;
            }

            await StockManagementApi.addStock({
                ...selectedStock,
                logo: logoUrl,
                sector: sector,
                exchange: selectedStock.exchange,
                isTradable: false,
                isVisible: false,
                price: 0,
                name: selectedStock.name,
                symbol: selectedStock.symbol,
            });

            toast.success(`${selectedStock.symbol} onboarded successfully`);
            onSuccess();
            onClose();
            // Reset
            handleBack();
        } catch (err: unknown) {
            console.error('Onboarding error:', err);
            let msg = 'Failed to onboard stock';
            if (isAxiosError(err)) {
                msg = err.response?.data?.message || msg;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const getSuffixedSymbol = (symbol: string, exchange: string) => {
        if (exchange === 'NSE') return `${symbol}.NS`;
        if (exchange === 'BSE') return `${symbol}.BS`;
        return symbol;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
                className="w-full max-w-lg bg-[#0b0c0e] border border-[#1e2025] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {/* Header */}
                <div className="relative h-1 bg-teal-500 w-full" />
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#1e2025]">
                    <div className="flex items-center gap-3">
                        {step === 'details' && (
                            <button
                                onClick={handleBack}
                                className="p-1.5 hover:bg-[#1e2025] rounded-lg transition-colors text-[#5a5f6e] hover:text-white"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                {step === 'search' ? 'Onboard New Assets' : 'Confirm Asset Details'}
                            </h2>
                            <p className="text-[10px] text-[#5a5f6e]">
                                {step === 'search' ? 'Search NSE/BSE stocks' : 'Verify symbol and upload logo'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#1e2025] rounded-lg transition-colors text-[#5a5f6e] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'search' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or symbol..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full bg-[#111214] border border-[#1e2025] rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#5a5f6e] focus:outline-none focus:border-teal-500/50 transition-all"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="animate-spin text-teal-500" size={16} />
                                    </div>
                                )}
                            </div>

                            <div className="h-[320px] overflow-y-auto custom-scrollbar space-y-2">
                                {results.length > 0 ? (
                                    results.map((stock) => (
                                        <div
                                            key={`${stock.symbol}-${stock.exchange}`}
                                            onClick={() => handleSelectStock(stock)}
                                            className="group flex items-center justify-between p-3 rounded-lg bg-[#111214] border border-[#1e2025] hover:border-teal-500/30 hover:bg-[#141518] transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center text-teal-500 font-bold text-[10px]">
                                                    {stock.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-white">{stock.symbol}</span>
                                                        <span className="px-1 py-0.5 rounded text-[8px] bg-teal-500/10 text-teal-500 font-medium">
                                                            {stock.exchange}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-[#5a5f6e] truncate max-w-[200px]">
                                                        {stock.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <Plus size={14} className="text-[#5a5f6e] group-hover:text-teal-500 transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                                        <Search size={24} className="text-[#1e2025]" />
                                        <p className="text-[11px] text-[#5a5f6e]">
                                            {searchQuery.length > 2 ? 'No matches found' : 'Enter at least 3 characters'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {step === 'details' && selectedStock && (
                        <div className="space-y-6">
                            {/* Asset Summary Card */}
                            <div className="p-4 rounded-xl bg-[#111214] border border-[#1e2025] flex items-center gap-4">
                                <div className="relative group">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-16 h-16 rounded-xl bg-[#0b0c0e] border-2 border-dashed border-[#1e2025] group-hover:border-teal-500/50 transition-all flex items-center justify-center cursor-pointer overflow-hidden"
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <Upload size={20} className="text-[#5a5f6e] group-hover:text-teal-500" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-white">
                                            {getSuffixedSymbol(selectedStock.symbol, selectedStock.exchange)}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-500 font-bold">
                                            {selectedStock.exchange}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[#5a5f6e] font-medium mt-0.5">
                                        {selectedStock.name}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-[#5a5f6e]">
                                            <Globe size={10} /> {selectedStock.country}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-[#5a5f6e]">
                                            <Landmark size={10} /> {selectedStock.currency}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#5a5f6e] mb-1.5 block">
                                        Sector Classification
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5f6e]" size={14} />
                                        <input
                                            type="text"
                                            value={sector}
                                            onChange={(e) => setSector(e.target.value)}
                                            className="w-full bg-[#111214] border border-[#1e2025] rounded-lg py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-teal-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-500/10">
                                    <p className="text-[10px] text-teal-500/80 leading-relaxed">
                                        Note: This asset will be initialized as <b>Hidden</b> and <b>Non-Tradable</b>.
                                        You can enable these statuses from the management table after onboarding.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleOnboard}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={14} />
                                        Processing Onboarding...
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} />
                                        Complete Onboarding
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
};
