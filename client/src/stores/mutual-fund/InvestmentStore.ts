import { create } from "zustand";

interface InvestmentRecord {
    schemeCode: string;
    amount: number;
    nav: number;
    navDate: Date | null;
    units: number;
}

interface InvestmentStore extends InvestmentRecord {
    setSchemeCode: (schemeCode: string) => void;
    setAmount: (amount: number) => void;
    setNav: (nav: number) => void;
    setNavDate: (navDate: Date) => void;
    setUnits: (units: number) => void;
    reset: () => void;
}



const initialState: InvestmentRecord = {
    schemeCode: "",
    amount: 0,
    nav: 0,
    navDate: null,
    units: 0,
};

export const useInvestmentStore = create<InvestmentStore>((set) => ({
    ...initialState,

    setSchemeCode: (schemeCode) => set({ schemeCode }),

    setAmount: (amount) => set({ amount }),

    setNav: (nav) => set({ nav }),

    setNavDate: (navDate) => set({ navDate }),

    setUnits: (units) => set({ units }),

    reset: () => set(initialState),
}));
