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
