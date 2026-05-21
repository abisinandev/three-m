export interface IChangeFundStatusUseCase {
    execute(fundId: string): Promise<void>
}