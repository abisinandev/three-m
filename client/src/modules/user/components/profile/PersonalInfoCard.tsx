import { useUserStore } from '@stores/user/UserStore';

interface PersonalInfoCardProps {
  setShowEditModal: (show: boolean) => void;
  isKycVerified: boolean;
  maskedAadhaar: string;
}

export const PersonalInfoCard = ({
  setShowEditModal,
  isKycVerified,
  maskedAadhaar
}: PersonalInfoCardProps) => {
  const { user } = useUserStore();

  return (
    <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="overflow-hidden">
      <div style={{ borderBottom: '1px solid #1e2025' }} className="px-5 py-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Personal Information</h3>
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            padding: '4px 12px', borderRadius: 4,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            color: '#22c55e', fontSize: 10, fontWeight: 700, cursor: 'pointer'
          }}
        >
          EDIT
        </button>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
          <p className="text-[13px] font-medium text-gray-200">{user?.fullName || '—'}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
          <p className="text-[13px] font-medium text-gray-200">{user?.email || '—'}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Phone Number</label>
          <p className="text-[13px] font-medium text-gray-200">{user?.phone ? `+91 ${user.phone}` : 'Not added'}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">PAN Number</label>
          <p className="text-[13px] font-medium text-gray-200">{isKycVerified ? user?.kyc.panNumber : "Not added"}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Aadhaar Number</label>
          <p className="text-[13px] font-medium text-gray-200">{isKycVerified ? maskedAadhaar : "Not added"}</p>
        </div>
      </div>
    </div>
  );
};
