import React from 'react';
import type { DetailsData } from '../types/KycTypes';

interface KycDetailsFormProps {
    details: DetailsData;
    setDetails: React.Dispatch<React.SetStateAction<DetailsData>>;
}

export const KycDetailsForm = ({ details, setDetails }: KycDetailsFormProps) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">Full Name (as on PAN)</label>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={details.fullName}
                    readOnly
                    className="w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] opacity-70 cursor-not-allowed font-medium"
                />
            </div>
            <div>
                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">PAN Number</label>
                <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={details.panNumber}
                    onChange={(e) => setDetails(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0, 10) }))}
                    className="w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium tracking-wider uppercase transition-all"
                />
            </div>
            <div>
                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">Aadhar Number</label>
                <input
                    type="text"
                    placeholder="12-digit number"
                    value={details.aadharNumber}
                    onChange={(e) => setDetails(prev => ({ ...prev, aadharNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                    className="w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium tracking-wider transition-all"
                />
            </div>
        </div>
    );
};
