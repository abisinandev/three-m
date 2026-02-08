export interface IExpenseTrackerUseCase {
    execute(userId: string): Promise<any>;
}