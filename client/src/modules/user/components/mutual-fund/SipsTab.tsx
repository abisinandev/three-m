import React, { useState } from 'react';
import { CalendarCheck, Pause, Play, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';
import type { SipDto } from '@modules/user/types/mutual-fund.types';
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
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2.5">
                <CalendarCheck size={18} className="text-green-400" />
                Your Active SIPs
            </h3>

            {sipsLoading ? (
                <div className="py-12 text-center text-gray-500">Loading SIPs...</div>
            ) : sips.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                    No active SIPs yet. Start investing regularly!
                </div>
            ) : (
                sips.map(sip => (
                    <div key={sip.id} className="border border-[#2a2a2a] rounded-lg p-4 bg-[#0d0d0d]">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="font-medium text-white">{sip.schemeCode}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    ₹{sip.amount} • {sip.frequency}
                                    <span className="ml-3 text-gray-500">Started: {dayjs(sip.startDate).format('DD MMM YYYY')}</span>
                                </p>
                                <p className="text-xs mt-1.5 flex items-center gap-1.5">
                                    Next: <span className="text-green-400 font-medium">{dayjs(sip.nextExecutionDate).format('DD MMM YYYY')}</span>
                                    {sip.status === 'PAUSED' && (
                                        <span className="inline-flex items-center gap-1 text-yellow-400 text-xs ml-2">
                                            <AlertCircle size={12} /> Paused
                                        </span>
                                    )}
                                    {sip.status === 'CANCELLED' && (
                                        <span className="inline-flex items-center gap-1 text-red-500 text-xs ml-2">
                                            <AlertCircle size={12} /> Cancelled
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                {sip.status === 'CANCELLED' ? (
                                    <span className="px-3 py-1 bg-red-900/20 text-red-500 text-xs font-semibold rounded-full border border-red-900/30">
                                        Terminated
                                    </span>
                                ) : (
                                    <>
                                        {sip.status === 'ACTIVE' ? (
                                            <button
                                                onClick={() => openConfirmModal('pause', sip.id, sip.schemeCode)}
                                                className="p-2 bg-yellow-900/40 text-yellow-300 rounded hover:bg-yellow-900/60 transition-colors"
                                                title="Pause SIP"
                                            >
                                                <Pause size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleResume(sip.id)}
                                                className="p-2 bg-green-900/40 text-green-300 rounded hover:bg-green-900/60 transition-colors"
                                                title="Resume SIP"
                                            >
                                                <Play size={16} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => openConfirmModal('cancel', sip.id, sip.schemeCode)}
                                            className="p-2 bg-red-900/40 text-red-300 rounded hover:bg-red-900/60 transition-colors"
                                            title="Cancel SIP"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <details className="mt-3 group">
                            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 list-none flex items-center gap-2">
                                <span className="group-open:hidden"><ChevronDown size={14} /></span>
                                <span className="hidden group-open:block"><ChevronUp size={14} /></span>
                                Installments ({sip.installments?.length || 0})
                            </summary>
                            <div className="mt-2 space-y-1.5 text-xs pl-5 bg-[#121212] p-2 rounded">
                                {sip.installments?.map((inst, idx) => (
                                    <div key={inst.id || idx} className="flex justify-between text-gray-300 border-b border-[#222] last:border-0 pb-1 last:pb-0">
                                        <span>{dayjs(inst.executionDate).format('DD MMM YYYY')}</span>
                                        <span className={
                                            inst.status === 'success' ? 'text-green-400' :
                                                inst.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                                        }>
                                            ₹{inst.amount} • {inst.status}
                                        </span>
                                    </div>
                                ))}
                                {(!sip.installments || sip.installments.length === 0) && (
                                    <div className="text-gray-500 italic">No installments found</div>
                                )}
                            </div>
                        </details>
                    </div>
                ))
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.type === 'pause' ? 'Pause SIP?' : 'Cancel SIP?'}
                message={
                    <p>
                        Are you sure you want to {confirmModal.type} your SIP in <span className="text-white font-semibold">{confirmModal.sipName}</span>?
                        {confirmModal.type === 'cancel' && <span className="block mt-2 text-red-400">This action cannot be undone.</span>}
                    </p>
                }
                confirmText={confirmModal.type === 'pause' ? 'Pause SIP' : 'Cancel SIP'}
                variant={confirmModal.type === 'pause' ? 'warning' : 'destructive'}
            />
        </div>
    );
};

export default SipsTab;
