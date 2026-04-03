export function isIndianMarketOpen(): boolean {
    const now = new Date();

    // Force IST timezone
    const istTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const day = istTime.getDay();
    const currentTime = istTime.getHours() * 60 + istTime.getMinutes();

    if (day === 0 || day === 6) return false;

    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;

    return currentTime >= marketOpen && currentTime < marketClose;
}