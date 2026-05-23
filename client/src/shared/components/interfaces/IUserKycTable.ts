export interface KYCData {
    id: string;
    name: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    documents: string;
    submitted: string;
    verified: string;
}
