import React, { useState } from 'react';
import { CalendarCheck, Pause, Play, Trash2, AlertCircle, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import dayjs from 'dayjs';
import type { SipDto } from '../../types/dashboard.types';
import ConfirmModal from '@shared/components/modals/ConfirmModal';

interface SipsTabProps {
    sipsLoading: boolean;
    sips: SipDto[];
    handlePause: (id: string) => void;
    handleResume: (id: string) => void;
    handleEdit: (id: string) => void;
    handleCancel: (id: string) => void;
}

const SipsTab: React.FC<SipsTabProps> = ({
    sipsLoading,
    sips,
    handlePause,
    handleResume,
    handleCancel
}) => {
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'pause' | 'cancel' | null;
        sipId: string | null;
        sipName: string | null;
    }>({
        isOpen: false,
        type: null,
        sipId: null,
        sipName: null
    });

    const openConfirmModal = (type: 'pause' | 'cancel', sipId: string, sipName: string) => {
        setConfirmModal({
            isOpen: true,
            type,
            sipId,
            sipName
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: null,
            sipId: null,
            sipName: null
        });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.sipId || !confirmModal.type) return;

        if (confirmModal.type === 'pause') {
            handlePause(confirmModal.sipId);
        } else if (confirmModal.type === 'cancel') {
            handleCancel(confirmModal.sipId);
        }

        closeConfirmModal();
    };

    return (
        <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <CalendarCheck size={20} className="text-green-400" />
                    </div>
                    Active SIPs
                </h3>
                <span className="text-[10px] bg-[#1e2025] px-2.5 py-1 rounded-full text-gray-400 font-bold uppercase tracking-wider">
                    {sips.length} {sips.length === 1 ? 'Plan' : 'Plans'}
                </span>
            </div>

            {sipsLoading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">Synchronizing SIP Data...</p>
                </div>
            ) : sips.length === 0 ? (
                <div className="py-16 text-center bg-[#0d0d0e] rounded-xl border border-dashed border-[#1e2025]">
                    <div className="w-12 h-12 bg-[#1a1c20] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                        <Info size={24} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-400">No active SIPs found</h4>
                    <p className="text-[11px] text-gray-600 mt-2 max-w-[200px] mx-auto leading-relaxed">
                        Start your wealth creation journey with regular investments today.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sips.map(sip => (
                        <div key={sip.id} className="group relative border border-[#1e2025] hover:border-[#2a2d35] rounded-2xl p-5 bg-[#0d0d0e] transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                                
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={sip.logo || 'https://placeholder.com/48'} 
                                            alt={sip.schemeName} 
                                            className="w-12 h-12 rounded-xl object-cover bg-white/5 border border-[#1e2025]"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0d0d0e] flex items-center justify-center ${
                                            sip.status === 'ACTIVE' ? 'bg-green-500' : 
                                            sip.status === 'PAUSED' ? 'bg-amber-500' : 'bg-red-500'
                                        }`}>
                                            {sip.status === 'ACTIVE' ? <Play size={8} className="text-white fill-current" /> : 
                                             sip.status === 'PAUSED' ? <Pause size={8} className="text-white fill-current" /> : 
                                             <Trash2 size={8} className="text-white" />}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-1 group-hover:text-green-400 transition-colors">
                                            {sip.schemeName || sip.schemeCode}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[11px] font-bold">
                                            <span className="text-white tracking-wide">₹{sip.amount.toLocaleString('en-IN')}</span>
                                            <span className="w-1 h-1 bg-[#1e2025] rounded-full"></span>
                                            <span className="text-gray-500 uppercase tracking-tighter">{sip.frequency}</span>
                                            <span className="w-1 h-1 bg-[#1e2025] rounded-full"></span>
                                            <span className="text-[#4b505c]">{dayjs(sip.startDate).format('MMM D, YYYY')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 bg-[#111214] md:bg-transparent p-3 md:p-0 rounded-xl border border-[#1e2025] md:border-0">
                                    <div className="text-right">
                                        <p className="text-[9px] text-[#4b505c] font-black uppercase tracking-[0.1em] mb-1">Next Installment</p>
                                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-green-400">
                                            <Clock size={12} strokeWidth={3} />
                                            {dayjs(sip.nextExecutionDate).format('DD MMM YYYY')}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {sip.status !== 'CANCELLED' && (
                                            <>
                                                {sip.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => openConfirmModal('pause', sip.id, sip.schemeName || sip.schemeCode)}
                                                        className="w-9 h-9 flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-black transition-all duration-300"
                                                        title="Pause SIP"
                                                    >
                                                        <Pause size={16} strokeWidth={2.5} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleResume(sip.id)}
                                                        className="w-9 h-9 flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-black transition-all duration-300"
                                                        title="Resume SIP"
                                                    >
                                                        <Play size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => openConfirmModal('cancel', sip.id, sip.schemeName || sip.schemeCode)}
                                                    className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                                    title="Cancel SIP"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </>
                                        )}
                                        {sip.status === 'CANCELLED' && (
                                            <span className="px-4 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
                                                Cancelled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <details className="mt-5 border-t border-[#1e2025] pt-3 group">
                                <summary className="text-[10px] font-black text-[#4b505c] uppercase tracking-widest cursor-pointer hover:text-gray-300 list-none flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                                        Payment History ({sip.installments?.length || 0})
                                    </div>
                                    {sip.executedInstallments > 0 && (
                                        <span className="text-green-500/80">{sip.executedInstallments} Successful</span>
                                    )}
                                </summary>
                                <div className="mt-4 grid gap-2">
                                    {sip.installments?.map((inst, idx) => (
                                        <div key={inst.id || idx} className="flex justify-between items-center bg-[#111214] p-3 rounded-xl border border-[#1e2025]">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    inst.status === 'success' ? 'bg-green-500' :
                                                    inst.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                                                }`} />
                                                <span className="text-xs font-mono font-bold text-gray-300">{dayjs(inst.executionDate).format('DD MMM YYYY')}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-white">₹{inst.amount.toLocaleString('en-IN')}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                    inst.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                                    inst.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {inst.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!sip.installments || sip.installments.length === 0) && (
                                        <div className="py-4 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">No transaction history yet</div>
                                    )}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.type === 'pause' ? 'Pause Wealth Creation?' : 'Terminate SIP Plan?'}
                message={
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm leading-relaxed">
                            You are about to {confirmModal.type} your SIP for <span className="text-white font-bold">{confirmModal.sipName}</span>.
                        </p>
                        {confirmModal.type === 'cancel' ? (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-[11px] text-red-400 font-medium flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-[11px] text-amber-400 font-medium flex items-center gap-2">
                                    <Info size={14} />
                                    You can resume this SIP anytime from your dashboard.
                                </p>
                            </div>
                        )}
                    </div>
                }
                confirmText={confirmModal.type === 'pause' ? 'Pause Plan' : 'Terminate Plan'}
                variant={confirmModal.type === 'pause' ? 'warning' : 'destructive'}
            />
        </div>
    );
};

export default SipsTab;
