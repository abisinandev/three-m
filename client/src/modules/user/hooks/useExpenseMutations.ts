import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddExpenseApi, DeleteExpenseApi, type AddExpenseRequest, type AddIncomeRequest, AddIncomeApi } from "@shared/services/feature/expense-tracker/ExpenseTrackerApi";

export const useAddIncomeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddIncomeRequest) => AddIncomeApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: any) => {
            console.error("Failed to add income:", error);
            alert(error?.response?.data?.message || "Something went wrong while adding income");
        },
    });
};

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddExpenseRequest) => AddExpenseApi(data),
        onSuccess: () => {
            // Invalidate and refetch expense tracker data
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: any) => {
            console.error("Failed to add expense:", error);
            // Basic error handling - could be a toast notification
            alert(error?.response?.data?.message || "Something went wrong while adding the expense");
        },
    });
};

export const useDeleteExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (index: number) => DeleteExpenseApi(index),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: any) => {
            console.error("Failed to delete expense:", error);
            alert(error?.response?.data?.message || "Something went wrong while deleting the expense");
        },
    });
};
