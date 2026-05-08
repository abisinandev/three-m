import { AddIncomeDTO } from '@application/dto/expense-tracker/add-income.dto';
import { AddExpenseDTO } from '@application/dto/expense-tracker/add-expense.dto';

import { container } from '@infrastructure/inversify_di/container';
import { EXPENSE_TRACKER_TYPE } from '@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { ExpenseTrackerController } from '@presentation/http/controllers/expense-tracker/expense-tracker.controller';
import { ExpenseRoutes } from '@shared/routes/expense.routes';

import { Router } from 'express';
import { BudgetPlanRequestDTO } from '@application/dto/expense-tracker/budget-plan.dto';
const router = Router();
const expenseTrackerController = container.get<ExpenseTrackerController>(EXPENSE_TRACKER_TYPE.ExpenseTrackerController);

router.get(ExpenseRoutes.ROOT, expenseTrackerController.fetchDatas.bind(expenseTrackerController));
router.post(ExpenseRoutes.ADD_INCOME, validateDTO(AddIncomeDTO), expenseTrackerController.addIncome.bind(expenseTrackerController));
router.post(ExpenseRoutes.ADD_EXPENSE, validateDTO(AddExpenseDTO), expenseTrackerController.addExpense.bind(expenseTrackerController));
router.delete(ExpenseRoutes.DELETE_EXPENSE, expenseTrackerController.deleteExpense.bind(expenseTrackerController));
router.get(ExpenseRoutes.FETCH_ANALYTICS, expenseTrackerController.fetchAnalytics.bind(expenseTrackerController));
router.post(ExpenseRoutes.BUDGET_PLAN, validateDTO(BudgetPlanRequestDTO), expenseTrackerController.calculateBudgetPlan.bind(expenseTrackerController));


export default router;
