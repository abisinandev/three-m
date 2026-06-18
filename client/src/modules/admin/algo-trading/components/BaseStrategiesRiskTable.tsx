import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchAdminBaseStrategies, UpdateAdminStrategyRiskConfig } from '@/shared/services/admin/algo-trading/admin-algo-trading-api';
import { Edit2, Shield, Target, TrendingDown, TrendingUp, Info, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { StrategyRiskConfig, BaseStrategy } from '@/shared/types/admin/algo-trading.types';

const BaseStrategiesRiskTable = () => {
    const queryClient = useQueryClient();
    const [editingStrategy, setEditingStrategy] = useState<string | null>(null);
    const [editData, setEditData] = useState<StrategyRiskConfig | null>(null);

    const { data: baseStrategies, isLoading } = useQuery<{ data: BaseStrategy[] }>({
        queryKey: ['admin-base-strategies'],
        queryFn: FetchAdminBaseStrategies
    });

    const updateMutation = useMutation({
        mutationFn: UpdateAdminStrategyRiskConfig,
        onSuccess: () => {
            toast.success('Risk settings updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-base-strategies'] });
            setEditingStrategy(null);
            setEditData(null);
        },
        onError: (err) => {
            toast.error(err.response.data.message || 'Failed to update risk settings');
        }
    });

    const handleEdit = (strategy: BaseStrategy) => {
        setEditingStrategy(strategy.name);
        setEditData({
            strategyName: strategy.name,
            riskAmount: strategy.riskConfig?.riskAmount || 1000,
            maxTradesPerDay: strategy.riskConfig?.maxTradesPerDay || 5,
            stopLoss: strategy.riskConfig?.stopLoss || 100,
            takeProfit: strategy.riskConfig?.takeProfit || 200
        });
    };

    const handleSave = () => {
        if (editData) {
            updateMutation.mutate(editData);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const containerStyle: React.CSSProperties = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '16px'
    };

    return (
        <div style={containerStyle}>
            <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-emerald-500/10 rounded-md">
                    <Shield className="text-emerald-500" size={16} />
                </div>
                <div>
                    <h2 className="text-[14px] font-bold text-white tracking-tight">Base Strategy Risk Control</h2>
                    <p className="text-neutral-500 text-[11px]">Manage global risk parameters for the core algorithmic strategies.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {baseStrategies?.data?.map((strategy: BaseStrategy) => (
                    <div key={strategy.name} className="bg-[#111214] border border-[#1e2025] rounded-lg overflow-hidden transition-all">
                        <div className="px-4 py-3 border-b border-[#1e2025] flex justify-between items-center bg-[#111214]">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-emerald-500/10 rounded flex items-center justify-center border border-emerald-500/20">
                                    <span className="text-emerald-500 font-bold text-[11px]">{strategy.name}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-[13px]">{strategy.displayName}</h3>
                                    <div className="flex gap-1.5 mt-0.5">
                                        {strategy.configSchema.map((schema: { key: string; default: string | number }) => (
                                            <span key={schema.key} className="px-1.5 py-0.5 bg-[#1e2025] text-neutral-500 rounded text-[9px] uppercase font-bold">
                                                {schema.key}: {schema.default}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {editingStrategy === strategy.name ? (
                                <div className="flex gap-1.5">
                                    <button 
                                        onClick={() => { setEditingStrategy(null); setEditData(null); }}
                                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={updateMutation.isPending}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} />
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleEdit(strategy)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2025] hover:bg-[#25282e] text-neutral-300 rounded text-[11px] font-bold transition-all border border-[#2a2d35]"
                                >
                                    <Edit2 size={14} />
                                    Edit Risk
                                </button>
                            )}
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                                    <Target size={12} />
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Risk Amount</label>
                                </div>
                                {editingStrategy === strategy.name && editData ? (
                                    <input 
                                        type="number"
                                        value={editData.riskAmount}
                                        onChange={(e) => setEditData({ ...editData, riskAmount: Number(e.target.value) })}
                                        className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                ) : (
                                    <div className="text-[15px] font-bold text-white">₹{(strategy.riskConfig?.riskAmount || 1000).toLocaleString()}</div>
                                )}
                                <p className="text-[10px] text-neutral-600 font-medium">Capital per trade signal.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                                    <TrendingDown size={12} />
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Stop Loss</label>
                                </div>
                                {editingStrategy === strategy.name && editData ? (
                                    <input 
                                        type="number"
                                        value={editData.stopLoss}
                                        onChange={(e) => setEditData({ ...editData, stopLoss: Number(e.target.value) })}
                                        className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                ) : (
                                    <div className="text-[15px] font-bold text-red-500">₹{(strategy.riskConfig?.stopLoss || 100).toLocaleString()}</div>
                                )}
                                <p className="text-[10px] text-neutral-600 font-medium">Fixed loss exit value.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                                    <TrendingUp size={12} />
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Take Profit</label>
                                </div>
                                {editingStrategy === strategy.name && editData ? (
                                    <input 
                                        type="number"
                                        value={editData.takeProfit}
                                        onChange={(e) => setEditData({ ...editData, takeProfit: Number(e.target.value) })}
                                        className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                ) : (
                                    <div className="text-[15px] font-bold text-emerald-500">₹{(strategy.riskConfig?.takeProfit || 200).toLocaleString()}</div>
                                )}
                                <p className="text-[10px] text-neutral-600 font-medium">Fixed profit target value.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                                    <Info size={12} />
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Daily Trades</label>
                                </div>
                                {editingStrategy === strategy.name && editData ? (
                                    <input 
                                        type="number"
                                        value={editData.maxTradesPerDay}
                                        onChange={(e) => setEditData({ ...editData, maxTradesPerDay: Number(e.target.value) })}
                                        className="w-full bg-[#0b0c0e] border border-[#1e2025] rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-emerald-500/50"
                                    />
                                ) : (
                                    <div className="text-[15px] font-bold text-white">{strategy.riskConfig?.maxTradesPerDay || 5}</div>
                                )}
                                <p className="text-[10px] text-neutral-600 font-medium">Max trades per strategy.</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BaseStrategiesRiskTable;

