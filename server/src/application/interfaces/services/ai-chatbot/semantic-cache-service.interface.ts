export interface ISemanticCacheService {
    get(query: string, threshold?: number): Promise<string | null>;

    set(query: string, response: string): Promise<void>;
}
