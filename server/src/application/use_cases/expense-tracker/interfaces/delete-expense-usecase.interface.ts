export interface IDeleteExpenseUseCase {
    execute(userId: string, expenseIndex: number): Promise<void>;
}
