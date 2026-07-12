export interface kycDocuments {
  _id?: string;
  type: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
}

export interface Address{
  fullName: string;
  city: string;
  state: string;
  pincode: string;
}
export interface KycUser {
  id: string;
  userCode: string;
  fullName: string;
  documents: kycDocuments[];
  address: Address;
  email: string;
  panNumber: string;
  aadharNumber: string;
  status: string;
  rejectionReason?: string;
  submissionCount?: number;
  createdAt: string;
}
export interface DetailsData {
    fullName: string;
    panNumber: string;
    aadharNumber: string;
}

export interface AddressData {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    isPincodeValid?: boolean;
}

export interface KycFiles {
    pan: File | null;
    aadhaar: File | null;
    selfie: File | null;
}

export interface KycPreviews {
    pan: string | null;
    aadhaar: string | null;
    selfie: string | null;
}
