export interface IXirrCalculationUseCase {
    execute(userId: string): Promise<number | null>;
}