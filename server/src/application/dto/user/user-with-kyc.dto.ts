export interface UserKycCombined {
  id: string;
  fullName: string;
  email: string;
  phone: string;

  kyc: {
    status: string;
    isVerified: boolean;
    panNumber: string;
    aadharNumber: string;
    documents: {
      type: string;
      fileName: string;
      fileUrl: string;
    }[];
    address: {
      fullAddress: string;
      city: string;
      state: string;
      pinCode: string;
    };
  } | null;
}
