export interface IIdempotencyService {

    checkAndLock(
        key: string,
        body: unknown
    ): Promise<void>;

    clear(
        key: string
    ): Promise<void>;
}