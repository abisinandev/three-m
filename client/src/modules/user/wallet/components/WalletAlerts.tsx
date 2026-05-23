import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { ROUTES } from '@shared/constants/routes';

export const KycWarningBox: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between gap-4 bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2.5">
                <AlertTriangle className="text-amber-500" size={14} />
                <p className="text-[11px] font-medium text-amber-200/80 uppercase tracking-tight">
                    KYC verification is required to enable wallet features.
                </p>
            </div>
            <button
                onClick={() => navigate({ to: ROUTES.USER.PROFILE })}
                className="text-[10px] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors"
            >
                VERIFY NOW
            </button>
        </div>
    );
};

export const WalletFrozenAlert: React.FC = () => (
    <div className="flex items-center gap-2.5 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3 text-red-400">
        <AlertTriangle size={14} />
        <p className="text-[11px] font-medium uppercase tracking-tight">Account Restricted. Contact terminal support.</p>
    </div>
);
