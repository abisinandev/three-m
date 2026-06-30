import type { UserType } from "@/shared/types/user/UserType";

interface SecurityCardProps {
  setShowPasswordModal: (show: boolean) => void;
  user: UserType | null;
}

export const SecurityCard = ({
  setShowPasswordModal,
  user
}: SecurityCardProps) => {
  const isGoogleUser = user?.authProvider === "google";

  const daysAgo = user?.createdAt
    ? Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;
  
  return (
    <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="overflow-hidden">
      <div style={{ borderBottom: '1px solid #1e2025' }} className="px-5 py-3">
        <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">Security & Privacy</h3>
      </div>
      <div className="p-5 space-y-5">

        {/* Password Change */}
        <div style={{ borderTop: '1px solid #1e2025' }} className="pt-5 flex items-center justify-between">
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#e8eaed', margin: 0 }}>Password</p>
            <p style={{ fontSize: 11, color: '#5a5f6e', margin: '2px 0 0 0' }}>
              {isGoogleUser ? "Managed by Google" : `Last updated ${daysAgo} days ago`}
            </p>
          </div>
          <button
            onClick={() => !isGoogleUser && setShowPasswordModal(true)}
            disabled={isGoogleUser}
            style={{
              padding: '6px 14px', borderRadius: 4,
              background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2025',
              color: isGoogleUser ? '#5a5f6e' : '#e8eaed',
              fontSize: 10, fontWeight: 700,
              cursor: isGoogleUser ? 'not-allowed' : 'pointer',
              opacity: isGoogleUser ? 0.5 : 1,
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => { if (!isGoogleUser) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { if (!isGoogleUser) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          >
            {isGoogleUser ? "SOCIAL LOGIN" : "CHANGE PASSWORD"}
          </button>
        </div>

      </div>
    </div>
  );
};
