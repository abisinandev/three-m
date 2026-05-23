import type { ChartPoint, NavHistory } from "../types/details.types";

export function formatNavDate(navDate?: string | Date) {
    if (!navDate) return "--";

    const d = new Date(navDate);
    if (isNaN(d.getTime())) return "--";

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function buildChartData(navHistory: NavHistory[]): ChartPoint[] {
  return [...navHistory]
    .sort((a, b) => new Date(a.navDate).getTime() - new Date(b.navDate).getTime())
    .map(n => ({
      date: new Date(n.navDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      nav: n.nav,
    }));
}

export function calculateUnitPrice(investment: number, nav: number) {
  return investment / nav
}
