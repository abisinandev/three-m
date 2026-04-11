export function generateCacheKey(message: string): string {
    return message
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}