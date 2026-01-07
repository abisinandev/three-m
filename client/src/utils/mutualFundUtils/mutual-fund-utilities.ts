const TRUSTED_AMCS = ["HDFC", "SBI", "ICICI", "AXIS", "UTI", "NIPPON", "TATA", "DSP", "ADITYA BIRLA"];
const REJECT_WORDS = ["DIVIDEND", "IDCW", "PAYOUT", "BONUS", "MONTHLY", "WEEKLY", "DAILY", "FMP", "INSTITUTIONAL", "RETIREMENT", "PROVIDENT"];
const ALLOWED_TYPES = ["INDEX", "NIFTY", "SENSEX", "LARGE", "MID", "FLEXI", "MULTI", "ELSS"];

export function isValidFund(name: string): boolean {
    const n = name.toUpperCase();
    if (REJECT_WORDS.some(w => n.includes(w))) return false;
    if (!n.includes("GROWTH")) return false;
    if (!TRUSTED_AMCS.some(amc => n.includes(amc))) return false;
    if (!ALLOWED_TYPES.some(t => n.includes(t))) return false;
    return true;
}

export function extractAMC(name: string) {
    return TRUSTED_AMCS.find(amc => name.toUpperCase().includes(amc)) ?? "UNKNOWN";
}

export function autoCategory(name: string) {
    const n = name.toUpperCase();
    if (n.includes("INDEX") || n.includes("NIFTY") || n.includes("SENSEX")) return "Index";
    return "Equity";
}

export function autoSubCategory(name: string) {
    const n = name.toUpperCase();
    if (n.includes("LARGE") && n.includes("MID")) return "Multi Cap";
    if (n.includes("FLEXI")) return "Flexi Cap";
    if (n.includes("MULTI")) return "Multi Cap";
    if (n.includes("SMALL")) return "Small Cap";
    if (n.includes("MID")) return "Mid Cap";
    if (n.includes("LARGE")) return "Large Cap";
    if (n.includes("ELSS")) return "ELSS";
    if (n.includes("INDEX")) return "Index";
    return "Other";
}

export function autoRisk(sub: string) {
    if (sub === "Small Cap") return "High";
    if (sub === "Mid Cap") return "Medium";
    if (sub === "Multi Cap" || sub === "Flexi Cap") return "High";
    if (sub === "Large Cap") return "Medium";
    if (sub === "ELSS") return "High";
    if (sub === "Index") return "Medium";
    return "Medium";
}