import React from 'react';
import { User, Mail, Hash, FileText, MapPin, AlertCircle } from 'lucide-react';

interface AdminKycUserInfoProps {
  kyc: any;
  status: string;
}

export const AdminKycUserInfo = ({ kyc, status }: AdminKycUserInfoProps) => {
  return (
    <div className="bg-[#111214] rounded-2xl border border-[#1e2025] p-6 shadow-2xl">
      <h2 className="text-[14px] font-bold text-[#e8eaed] mb-6 flex items-center gap-2 tracking-tight">
        <User className="w-4 h-4 text-[#00C853]" /> User Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13px]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
            <User className="w-4 h-4 text-[#5a5f6e]" />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">Full Name</p>
            <p className="font-bold text-[#e8eaed]">{kyc.fullName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
            <Mail className="w-4 h-4 text-[#5a5f6e]" />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">Email</p>
            <p className="font-bold text-[#e8eaed]">{kyc.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
            <Hash className="w-4 h-4 text-[#5a5f6e]" />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">User Code</p>
            <p className="font-mono text-[#e8eaed] font-bold tracking-tight">{kyc.userCode || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status === "VERIFIED" ? '#00C853' : status === "REJECTED" ? '#F44336' : '#FFB300' }} />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">Status</p>
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
              status === "VERIFIED" ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20 shadow-[0_0_10px_rgba(0,200,83,0.1)]" :
              status === "REJECTED" ? "bg-[#F44336]/10 text-[#F44336] border-[#F44336]/20 shadow-[0_0_10px_rgba(244,67,54,0.1)]" :
              "bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/20"
            }`}>
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
            <FileText className="w-4 h-4 text-[#5a5f6e]" />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">PAN Number</p>
            <p className="font-mono font-bold text-[#e8eaed] tracking-tight">{kyc.panNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center shadow-inner">
            <FileText className="w-4 h-4 text-[#5a5f6e]" />
          </div>
          <div>
            <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-0.5">Aadhar Number</p>
            <p className="font-mono font-bold text-[#e8eaed] tracking-tight">XXXX-XXXX-{String(kyc.aadharNumber).slice(-4)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4 pt-6 border-t border-[#1e2025]">
        <div className="w-10 h-10 rounded-full bg-[#0b0c0e] border border-[#1e2025] flex items-center justify-center flex-shrink-0 shadow-inner">
          <MapPin className="w-4 h-4 text-[#5a5f6e]" />
        </div>
        <div>
          <p className="text-[#5a5f6e] text-[11px] font-medium tracking-wider uppercase mb-1">Registered Address</p>
          <p className="text-[#e8eaed] text-[13px] font-medium leading-relaxed">
            {kyc.address?.fullAddress}, {kyc.address?.city}, {kyc.address?.state} - {kyc.address?.pincode || kyc.address?.pinCode}
          </p>
        </div>
      </div>

      {kyc.rejectionReason && (
        <div className="mt-6 p-4 bg-[#F44336]/10 border border-[#F44336]/30 rounded-xl">
          <p className="text-[#F44336] text-[13px] font-bold flex items-center gap-2 mb-1 tracking-tight">
            <AlertCircle className="w-4 h-4" />
            Rejection Reason
          </p>
          <p className="text-[#F44336]/80 text-[12px] font-medium">{kyc.rejectionReason}</p>
        </div>
      )}
    </div>
  );
};
