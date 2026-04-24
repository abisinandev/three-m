export const EXPENSE_TRACKER_TYPE = {
    //usecase
    ExpenseTrackerUseCase: Symbol.for("ExpenseTrackerUseCase"),
    AddIncomeUseCase: Symbol.for("AddIncomeUseCase"),
    AddExpenseUseCase: Symbol.for("AddExpenseUseCase"),
    DeleteExpenseUseCase: Symbol.for("DeleteExpenseUseCase"),
    AnalyticsUseCase: Symbol.for("AnalyticsUseCase"),
    CalculateSimulationUseCase: Symbol.for("CalculateSimulationUseCase"),


    //repository
    ExpenseTrackerRepository: Symbol.for('ExpenseTrackerRepository'),

    ExpenseTrackerController: Symbol.for("ExpenseTrackerController"),
}