export interface IExpenseTrackerUseCase {
    execute(userId: string, month?: string): Promise<any>;
}