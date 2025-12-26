export interface User {
    id: string;
    userCode: string;
    fullName: string;
    email: string;
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: string;
}