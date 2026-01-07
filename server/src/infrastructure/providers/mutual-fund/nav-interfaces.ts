export interface MfApiNavItem {
    date: string;
    nav: string;
}

export interface MfApiNavResponse {
    meta: {
        scheme_code: string;
        scheme_name: string;
    };
    data: MfApiNavItem[];
}

export interface ParsedNav {
    date: Date;
    nav: number;
}