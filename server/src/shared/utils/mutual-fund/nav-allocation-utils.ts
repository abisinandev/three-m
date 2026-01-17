export function getNavDate(createdAt: Date): Date {
    const date = new Date(createdAt);
    date.setHours(0, 0, 0, 0);
    return date;
}

export function isSameDate(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}