import { Camera } from 'lucide-react';
import { useUserStore } from '@stores/user/UserStore';

interface ProfileSidebarProps {
  uploading: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (name: string) => string;
  formatJoinDate: (date?: string) => string;
  kycInfo: any;
  navigate: any;
  ROUTES: any;
}

export const ProfileSidebar = ({
  uploading,
  handleImageChange,
  getInitials,
  formatJoinDate,
  kycInfo,
  navigate,
  ROUTES
}: ProfileSidebarProps) => {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col gap-4">
      <div style={{ background: '#111214', border: '1px solid #1e2025', borderRadius: 6 }} className="p-6 flex flex-col items-center text-center">
        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-full bg-[#1e2025] border border-[#2d3139] p-1.5 shadow-xl relative overflow-hidden">
            <div className="w-full h-full rounded-full bg-[#0b0c0e] flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName ? getInitials(user.fullName) : 'U'
              )}
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
              <Camera className="w-5 h-5 text-white/80" />
            </div>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </div>
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e8eaed', margin: '0 0 2px 0' }}>
          {user?.fullName || 'Account User'}
        </h2>
        <p style={{ fontSize: 11, color: '#5a5f6e', margin: 0 }}>
          {user?.email}
        </p>

        <div className="mt-4 pt-4 border-t border-[#1e2025] w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Member Since</span>
            <span className="text-[10px] font-bold text-gray-300">{formatJoinDate(user?.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">User Code</span>
            <span className="text-[10px] font-bold text-gray-300">{user?.userCode || '—'}</span>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div style={{ 
        background: kycInfo.badgeBg, 
        border: `1px solid ${kycInfo.badgeBorder}`, 
        borderRadius: 6 
      }} className="p-4">
         <div className="flex items-center gap-2 mb-2">
            <div style={{ 
              width: 6, height: 6, borderRadius: '50%', 
              background: kycInfo.badgeColor 
            }} />
            <span style={{ 
              fontSize: 10, fontWeight: 800, 
              color: kycInfo.badgeColor, letterSpacing: '0.05em' 
            }}>
              {kycInfo.badgeText}
            </span>
         </div>
         <p style={{ fontSize: 10, color: '#e8eaed', lineHeight: '1.4', margin: '0 0 12px 0', opacity: 0.8 }}>
           {kycInfo.message}
         </p>
         
         {kycInfo.button ? kycInfo.button : (
            <button
              onClick={() => navigate({ to: ROUTES.USER.KYC_VERIFICATION })}
              style={{
                width: '100%', padding: '6px 0', borderRadius: 4,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: kycInfo.badgeColor, fontSize: 10, fontWeight: 700, cursor: 'pointer'
              }}
            >
              {kycInfo.buttonText}
            </button>
         )}
      </div>
    </div>
  );
};
