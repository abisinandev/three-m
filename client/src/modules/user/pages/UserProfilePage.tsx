import { useUserStore } from '@stores/user/UserStore';
import { useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import ChangePasswordModal from '@shared/components/modals/ChangePasswordModal';
import { format } from 'date-fns';

import EditProfileModal from '@shared/components/modals/UserProfileEditModal';
import { useNavigate } from '@tanstack/react-router';
import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';
import { GetSignatureApi } from '@shared/services/user/GetSignatureApi';
import api from '@lib/axiosUser';
import { UPLOAD_PROFILE_IMAGE } from '@shared/constants/userContants';


const UserProfilePage = () => {
  const { user, setUser } = useUserStore();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatJoinDate = (date?: string) =>
    date ? format(new Date(date), 'MMM dd, yyyy') : '—';

  const kycStatus = user?.kycStatus;
  const hasKycStarted = user?.kycId || kycStatus;
console.log(user,'---')
  const kycInfo = (() => {
    if (!hasKycStarted) {
      return {
        badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
        badgeText: "Not Started",
        message: "Complete KYC to unlock withdrawals & premium features.",
        buttonText: "Start KYC",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
      };
    }

    if (user.isVerified && user.kycStatus === 'verified') {
      return {
        badge: "bg-green-500/20 text-green-400 border-green-500/40",
        badgeText: "Verified",
        message: "Your KYC is approved! You can now withdraw and access all features.",
        button: <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-medium">Verified</span>
        </div>,
      };
    }

    if (kycStatus === "pending") {
      return {
        badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40 animate-pulse",
        badgeText: "Pending Review",
        message: "Your documents are under review. We'll notify you soon.",
        button: <div className="text-yellow-400 text-xs font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          Under Review
        </div>,
      };
    }

    if (kycStatus === "rejected") {
      return {
        badge: "bg-red-500/20 text-red-400 border-red-500/40",
        badgeText: "Rejected",
        message: "KYC rejected. Please re-upload clear documents.",
        buttonText: "Re-Upload Documents",
        buttonColor: "bg-red-500 hover:bg-red-600",
      };
    }

    return {
      badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      badgeText: "Action Required",
      message: "Complete your KYC to continue.",
      buttonText: "Complete KYC",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    };
  })();

  const isKycVerified = user?.kycStatus === "verified";
  const maskedAadhaar = user?.aadhaarNumber
    ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}`
    : "Not added";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      const signatureData = await GetSignatureApi("profile", user.id);
      console.log('signatureData: ', signatureData.data)
      const result = await uploadToCloudinary(file, signatureData.data);
      console.log('result: ', result)
      await api.patch(UPLOAD_PROFILE_IMAGE, {
        userId: user?.id,
        url: result.secure_url
      });
      setUser({ ...user, avatar: result.secure_url });
    } catch (err) {
      console.error("Profile image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f] overflow-hidden">

          <div className="relative bg-gradient-to-r from-[#0f0f0f] to-[#111] px-6 py-10 text-center border-b border-[#222] overflow-hidden">

            {user?.isVerified && (
              <div className="absolute top-0 right-0 z-10">
                <div className="relative">
                  <div className="relative bg-gradient-to-br from-green-600 to-green-500 text-white font-bold text-xs tracking-wider px-10 py-2 transform rotate-45 translate-x-8 translate-y-6 shadow-2xl">
                    VERIFIED
                  </div>
                </div>
              </div>
            )}

            <div className="relative inline-block group mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22C55E] via-[#16a34a] to-[#15803d] p-1 shadow-2xl ring-4 ring-[#22C55E]/20">
                <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName ? getInitials(user.fullName) : 'U'
                  )}
                </div>
              </div>

              <div className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-6 h-6 text-white" />
                {uploading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
              </div>

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">{user?.fullName || 'User'}</h1>
            <p className="text-gray-400 text-sm mt-2">{user?.email || 'user@example.com'}</p>

            <span className="inline-block mt-3 text-xs font-medium text-gray-400 bg-[#1A1A1A] px-4 py-1.5 rounded-full border border-[#333]">
              Member since {formatJoinDate(user?.createdAt)}
            </span>
          </div>

          <div className="p-6 space-y-6">

            <section className="bg-[#111111] rounded-xl p-5 border border-[#222]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Personal Information</h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-xs font-semibold px-4 py-1.5 bg-[#22C55E] hover:bg-[#1ea853] text-white rounded-lg transition"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">User Code</span><span>{user?.userCode || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span>{user?.fullName || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{user?.phone ? `+91 ${user.phone}` : 'Not added'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{user?.email || '—'}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PAN</span>
                  <span>
                    {isKycVerified ? user?.panNumber : "Not added"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Aadhaar</span>
                  <span>
                    {isKycVerified ? maskedAadhaar : "Not added"}
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-orange-900/20 to-transparent rounded-xl p-5 border border-orange-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">KYC Verification</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${kycInfo.badge}`}>
                      {kycInfo.badgeText}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed max-w-md">
                    {kycInfo.message}
                  </p>
                </div>

                <div>
                  {kycInfo.button ? kycInfo.button : (
                    <button
                      onClick={() => navigate({ to: "/user/kyc-verification" })}
                      className={`px-6 py-2.5 rounded-lg font-semibold text-xs text-white shadow-lg transition-all ${kycInfo.buttonColor}`}
                    >
                      {kycInfo.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-[#111111] rounded-xl p-5 border border-[#222]">
              <h3 className="text-base font-semibold text-white mb-4">Security & Preferences</h3>
              <div className="space-y-6">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-medium">Two-Factor Authentication</p>
                    <p className="text-gray-500 text-xs">Add extra security with authenticator app</p>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                    className={`
                    relative w-12 h-6 rounded-full transition-colors 
                    ${twoFAEnabled ? 'bg-green-500' : 'bg-gray-700'}
                  `}
                  >
                    <span
                      className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all
                      ${twoFAEnabled ? 'translate-x-6' : 'translate-x-0'}
                    `}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                  <div>
                    <p className="text-white text-xs font-medium">Change Password</p>
                    <p className="text-gray-500 text-xs">Last changed 30 days ago</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-[#22C55E] hover:text-[#1ea853] text-xs font-semibold underline underline-offset-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default UserProfilePage;