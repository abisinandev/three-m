export class AsyncHelper {
    static async mapWithConcurrency<T, R>(
        items: T[],
        limit: number,
        mapper: (item: T) => Promise<R>
    ): Promise<R[]> {
        const chunks: T[][] = [];

        for (let i = 0; i < items.length; i += limit) {
            chunks.push(items.slice(i, i + limit));
        }

        const results: R[] = [];

        for (const chunk of chunks) {
            const chunkResults = await Promise.all(chunk.map(mapper));
            results.push(...chunkResults);
        }

        return results;
    }
}