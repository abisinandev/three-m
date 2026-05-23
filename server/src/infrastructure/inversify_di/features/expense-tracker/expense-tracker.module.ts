import { ContainerModule } from "inversify";
import { EXPENSE_TRACKER_TYPE } from "./expense-tracker.type";
import { ExpenseTrackerController } from "@presentation/http/controllers/expense-tracker/expense-tracker.controller";
import { IAddIncomeUseCase } from "@application/use_cases/expense-tracker/interfaces/add-income-usecase.interface";
import { AddIncomeUseCase } from "@application/use_cases/expense-tracker/add-income.usecase";
import { AddExpensesUseCase } from "@application/use_cases/expense-tracker/add-expenses.usecase";
import { IAddExpenseUseCase } from "@application/use_cases/expense-tracker/interfaces/add-expenses-usecase.interface";
import { IDeleteExpenseUseCase } from "@application/use_cases/expense-tracker/interfaces/delete-expense-usecase.interface";
import { IExpenseTrackerUseCase } from "@application/use_cases/expense-tracker/interfaces/expense-tracker-usecase.interface";
import { ExpenseTrackerUseCase } from "@application/use_cases/expense-tracker/expense-tracker.usecase";
import { DeleteExpenseUseCase } from "@application/use_cases/expense-tracker/delete-expense.usecase";
import { IAnalyticsUseCase } from "@application/use_cases/expense-tracker/interfaces/analytics-usecase.interface";
import { AnalyticsUseCase } from "@application/use_cases/expense-tracker/analytics.usecase";
import { ExpenseTrackerRepository } from "@infrastructure/databases/repository/expense-tracker/expense-tracker.repository";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { ICalculateBudgetPlanUseCase } from "@application/use_cases/expense-tracker/interfaces/calculate-budget-plan.usecase.interface";
import { CalculateBudgetPlanUseCase } from "@application/use_cases/expense-tracker/calculate-budget-plan.usecase";


export const ExpenseTrackerModule = new ContainerModule(({ bind }) => {

    bind<IExpenseTrackerUseCase>(EXPENSE_TRACKER_TYPE.ExpenseTrackerUseCase).to(ExpenseTrackerUseCase);
    bind<IAddIncomeUseCase>(EXPENSE_TRACKER_TYPE.AddIncomeUseCase).to(AddIncomeUseCase);
    bind<IAddExpenseUseCase>(EXPENSE_TRACKER_TYPE.AddExpenseUseCase).to(AddExpensesUseCase);
    bind<IDeleteExpenseUseCase>(EXPENSE_TRACKER_TYPE.DeleteExpenseUseCase).to(DeleteExpenseUseCase);
    bind<IAnalyticsUseCase>(EXPENSE_TRACKER_TYPE.AnalyticsUseCase).to(AnalyticsUseCase);
    bind<ICalculateBudgetPlanUseCase>(EXPENSE_TRACKER_TYPE.CalculateBudgetPlanUseCase).to(CalculateBudgetPlanUseCase);


    bind<IExpenseTrackerRepository>(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository).to(ExpenseTrackerRepository);

    bind<ExpenseTrackerController>(EXPENSE_TRACKER_TYPE.ExpenseTrackerController).to(ExpenseTrackerController);

})