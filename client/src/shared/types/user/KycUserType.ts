export interface kycDocuments {
  type: string;
  fileName: string;
  fileUrl: string;
}

export interface Address{
  fullName: string;
  city: string;
  state: string;
  pincode: string;
}
export interface KycUser {
  id: string;
  userId: string;
  userCode: string;
  fullName: string;
  documents: kycDocuments;
  address: Address
  email: string;
  panNumber: string;
  status: string;
  createdAt: string;
}
