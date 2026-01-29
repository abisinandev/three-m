import { NavHistoryDTO } from "@application/dto/mutual-funds/nav-histroy.dto";

export function calculateReturn(history: NavHistoryDTO[]) {
    if (history.length < 2) return 0;

    const yesterday = history[history.length - 2].nav;
    const today = history[history.length - 1].nav;

    return ((today - yesterday) / yesterday) * 100;
}