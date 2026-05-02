import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface AdminKycDocumentsProps {
  documents: any[];
}

export const AdminKycDocuments = ({ documents }: AdminKycDocumentsProps) => {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="bg-[#111214] rounded-2xl border border-[#1e2025] p-6 shadow-2xl">
      <h2 className="text-[14px] font-bold text-[#e8eaed] mb-6 flex items-center gap-2 tracking-tight">
        <FileText className="w-4 h-4 text-[#00C853]" /> Submitted Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc: any) => (
          <div
            key={doc._id || doc.type}
            className="bg-[#0b0c0e] rounded-xl border border-[#1e2025] overflow-hidden hover:border-[#00C853]/50 transition-all duration-300 group flex flex-col shadow-inner"
          >
            <div className="px-5 py-4 border-b border-[#1e2025] bg-[#111214]">
              <p className="text-[13px] font-bold text-[#e8eaed] capitalize tracking-tight">
                {doc.type === 'pan' ? 'PAN Card' : doc.type === 'aadhaar' ? 'Aadhar Card' : doc.type === 'selfie' ? 'Live Selfie' : doc.type}
              </p>
              <p className="text-[11px] text-[#5a5f6e] truncate mt-1 font-medium tracking-wider uppercase">
                {doc.fileName || `${doc.type}-document`}
              </p>
            </div>

            <div className="p-4 flex-grow flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] bg-[#0b0c0e] rounded-lg overflow-hidden border border-[#1e2025] flex items-center justify-center">
                {doc.fileUrl.toLowerCase().endsWith('.pdf') ? (
                   <div className="w-full h-full flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-[#5a5f6e] mb-3" />
                      <span className="text-[11px] text-[#5a5f6e] font-medium uppercase tracking-wider">PDF Document</span>
                   </div>
                ) : (
                  <img
                    src={doc.fileUrl}
                    alt={doc.type}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-[#00C853]/0 group-hover:bg-[#00C853]/5 transition-all duration-300 pointer-events-none" />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#1e2025] bg-[#111214] flex items-center justify-end">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#5a5f6e] hover:text-[#00C853] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                View Full Size <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
