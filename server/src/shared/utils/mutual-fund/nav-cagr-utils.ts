import { ParsedNav } from "@infrastructure/providers/mutual-fund/nav-interfaces";


// function parseMfApiDate(dateStr: string): Date {
//     const [dd, mm, yyyy] = dateStr.split("-");
//     return new Date(`${yyyy}-${mm}-${dd}`);
// }


// import axios from "axios";

// export async function getNavHistory(
//     schemeCode: string
// ): Promise<ParsedNav[]> {
//     const response = await axios.get<{
//         data: MfApiNavItem[];
//     }>(`https://api.mfapi.in/mf/${schemeCode}`);

//     return response.data.data.map((item) => ({
//         date: parseMfApiDate(item.date),
//         nav: Number(item.nav),
//     }));
// }


export function findOldNav(navList: ParsedNav[], yearsAgo: number): ParsedNav | null {
    const target = new Date();
    target.setFullYear(target.getFullYear() - yearsAgo);

    const candidates = navList
        .filter((n) => n.date <= target)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    return candidates[0] ?? null;
}




// export async function getCagr(
//     schemeCode: string,
//     years: number
// ): Promise<number | null> {
//     const navList = await getNavHistory(schemeCode);

//     if (navList.length === 0) return null;

//     const latestNav = navList[0];
//     const oldNav = findOldNav(navList, years);

//     if (!oldNav) return null;

//     const cagr = (latestNav.nav / oldNav.nav) ** (1 / years) - 1;

//     return +(cagr * 100).toFixed(2);
// }
