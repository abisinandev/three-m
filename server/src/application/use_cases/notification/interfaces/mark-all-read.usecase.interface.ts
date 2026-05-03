export interface IMarkAllReadUseCase {
    execute(userId: string): Promise<void>;
}
