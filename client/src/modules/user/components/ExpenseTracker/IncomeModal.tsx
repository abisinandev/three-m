'use client';
import { useState } from 'react';
import { X, Loader2, DollarSign } from 'lucide-react';
import { useAddIncomeMutation } from '@modules/user/hooks/useExpenseMutations';
import { toast } from 'sonner';
import { formatCurrency } from '@modules/user/helpers/expenseHelpers';

interface IncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    incomeSources: any[];
}

export const IncomeModal = ({ isOpen, onClose, incomeSources }: IncomeModalProps) => {
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceAmount, setNewSourceAmount] = useState('');

    const { mutate: addIncome, isPending: isAddingIncome } = useAddIncomeMutation();

    const handleAddIncomeSource = () => {
        if (!newSourceName || !newSourceAmount) {
            toast.error("Please fill all fields");
            return;
        }

        addIncome({
            source: newSourceName,
            amount: parseFloat(newSourceAmount)
        }, {
            onSuccess: () => {
                setNewSourceName('');
                setNewSourceAmount('');
                onClose();
                toast.success("Income source recorded");
            }
        });
    };

    if (!isOpen) return null;

    const labelStyle: React.CSSProperties = {
        fontSize: 10,
        fontWeight: 700,
        color: '#5a5f6e',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 6,
        display: 'block'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: '#111214',
        border: '1px solid #1e2025',
        borderRadius: 6,
        padding: '10px 12px',
        fontSize: 12,
        color: '#e8eaed',
        outline: 'none',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 420,
                background: '#0b0c0e',
                border: '1px solid #1e2025',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1e2025' }}>
                    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#e8eaed', margin: 0, letterSpacing: '0.02em' }}>ADD INCOME SOURCE</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a5f6e', cursor: 'pointer', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Source Name</label>
                        <input
                            style={inputStyle}
                            placeholder="e.g. Primary Salary"
                            value={newSourceName}
                            onChange={(e) => setNewSourceName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Amount (₹)</label>
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="0.00"
                            value={newSourceAmount}
                            onChange={(e) => setNewSourceAmount(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <button
                            onClick={handleAddIncomeSource}
                            disabled={isAddingIncome}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                background: '#e8eaed',
                                border: 'none',
                                borderRadius: 6,
                                color: '#0b0c0e',
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e8eaed'}
                        >
                            {isAddingIncome ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Income'}
                        </button>
                    </div>

                    <div style={{ marginTop: 12, borderTop: '1px solid #1e2025', paddingTop: 16 }}>
                        <p style={labelStyle}>Current Monthly Sources</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 120, overflowY: 'auto' }}>
                            {incomeSources.length === 0 ? (
                                <p style={{ fontSize: 10, color: '#3a3d45', fontStyle: 'italic', margin: 0 }}>No income recorded for this month.</p>
                            ) : (
                                incomeSources.map((source, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111214', padding: '8px 12px', borderRadius: 6, border: '1px solid #1e2025' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <DollarSign size={10} color="#00C853" />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#e8eaed' }}>{source.source}</span>
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{formatCurrency(source.amount)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
