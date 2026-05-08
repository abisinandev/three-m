export type UserFilters = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export type KycStatus = "pending" | "approved" | "rejected" | "submitted" | "all";

export type KycFilters = {
    page: number;
    status: KycStatus | string;
};

