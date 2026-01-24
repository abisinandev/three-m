export interface INavHistoryUseCase {
    execute(interval: string): Promise<void>
}