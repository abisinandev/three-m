import { ParsedNav } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";

export function findOldNav(navList: ParsedNav[], yearsAgo: number): ParsedNav | null {

    if (!navList.length || yearsAgo <= 0) return null;

    const target = new Date();
    target.setFullYear(target.getFullYear() - yearsAgo);

    for (const nav of navList) {
        if (nav.date <= target) {
            return nav;
        }
    }

    return null;
}
