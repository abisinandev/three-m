import { useUserStore } from '@stores/user/UserStore';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import ChangePasswordModal from '@shared/components/modals/ChangePasswordModal';
import { format } from 'date-fns';
import EditProfileModal from '@shared/components/modals/UserProfileEditModal';
import { useNavigate } from '@tanstack/react-router';

import { uploadToCloudinary } from '@utils/upload/UploadToCloudinary';
import { GetSignatureApi } from '@shared/services/user/get-signature-api';
import api from '@/lib/axios-user';
import { UPLOAD_PROFILE_IMAGE } from '@shared/constants/userContants';
import { ROUTES } from '@shared/constants/routes';

import { ProfileSidebar } from '../components/ProfileSidebar';
import { PersonalInfoCard } from '../components/PersonalInfoCard';
import { SecurityCard } from '../components/SecurityCard';

const UserProfilePage = () => {
  const { user, setUser } = useUserStore();
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
  const kycInfo = (() => {
    if (!hasKycStarted) {
      return {
        badgeColor: "#f59e0b",
        badgeBg: "rgba(245, 158, 11, 0.1)",
        badgeBorder: "rgba(245, 158, 11, 0.2)",
        badgeText: "NOT STARTED",
        message: "Complete KYC to unlock withdrawals & premium features.",
        buttonText: "START KYC",
        buttonColor: "#f59e0b",
      };
    }

    if (user.isVerified && user.kycStatus === 'verified') {
      return {
        badgeColor: "#10b981",
        badgeBg: "rgba(16, 185, 129, 0.1)",
        badgeBorder: "rgba(16, 185, 129, 0.2)",
        badgeText: "VERIFIED",
        message: "Your KYC is approved! You can now withdraw and access all features.",
        button: <div className="flex items-center gap-1.5 text-[#10b981] text-[10px] font-bold">
          <CheckCircle className="w-3.5 h-3.5" />
          VERIFIED
        </div>,
      };
    }

    if (kycStatus === "pending") {
      return {
        badgeColor: "#f59e0b",
        badgeBg: "rgba(245, 158, 11, 0.1)",
        badgeBorder: "rgba(245, 158, 11, 0.2)",
        badgeText: "PENDING REVIEW",
        message: "Your documents are under review. We'll notify you soon.",
        button: <div className="text-[#f59e0b] text-[10px] font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full animate-pulse" />
          UNDER REVIEW
        </div>,
      };
    }

    if (kycStatus === "rejected") {
      return {
        badgeColor: "#ef4444",
        badgeBg: "rgba(239, 68, 68, 0.1)",
        badgeBorder: "rgba(239, 68, 68, 0.2)",
        badgeText: "REJECTED",
        message: user?.kyc?.rejectionReason ? `Reason: ${user.kyc.rejectionReason}` : "KYC rejected. Please re-upload clear documents.",
        buttonText: "RESUBMIT",
        buttonColor: "#ef4444",
      };
    }

    return {
      badgeColor: "#f59e0b",
      badgeBg: "rgba(245, 158, 11, 0.1)",
      badgeBorder: "rgba(245, 158, 11, 0.2)",
      badgeText: "ACTION REQUIRED",
      message: "Complete your KYC to continue.",
      buttonText: "COMPLETE KYC",
      buttonColor: "#f59e0b",
    };
  })();

  const isKycVerified = user?.kycStatus === "verified";
  const maskedAadhar = user?.kyc?.aadharNumber || "Not added";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);

    try {
      const signatureData = await GetSignatureApi("profile", user.id);
      const result = await uploadToCloudinary(file, signatureData.data);
      await api.patch(UPLOAD_PROFILE_IMAGE, {
        userId: user?.id,
        url: result.secure_url
      });
      setUser({ ...user, avatar: result.secure_url });
    } catch (_err) {
      console.error("Profile image upload failed", _err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0c0e',
      color: '#e8eaed',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: 48,
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', letterSpacing: '-0.2px', margin: 0 }}>
              Profile Settings
            </h1>
            <p style={{ fontSize: 11, color: '#5a5f6e', marginTop: 2, margin: 0 }}>
              Manage your account and security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">

          <ProfileSidebar
            uploading={uploading}
            handleImageChange={handleImageChange}
            getInitials={getInitials}
            formatJoinDate={formatJoinDate}
            kycInfo={kycInfo}
            navigate={navigate}
            ROUTES={ROUTES}
          />

          <div className="flex flex-col gap-4">
            <PersonalInfoCard
              setShowEditModal={setShowEditModal}
              isKycVerified={isKycVerified}
              maskedAadhar={maskedAadhar}
            />

            <SecurityCard
              setShowPasswordModal={setShowPasswordModal}
              user={user}
            />
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
    </div>
  );
};

export default UserProfilePage;


