import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpenseApi, deleteExpenseApi, addIncomeApi } from "@/shared/services/expense-tracker/expense-service";
import { toast } from 'sonner';
import type { AddExpenseRequest, AddIncomeRequest } from "../types/expense.types";

export const useAddIncomeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddIncomeRequest) => addIncomeApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            console.error("Failed to add income:", error);
            toast.error(error?.response?.data?.message || "Something went wrong while adding income");
        },
    });
};

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddExpenseRequest) => addExpenseApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            console.error("Failed to add expense:", error);
            toast.error(error?.response?.data?.message || "Something went wrong while adding the expense");
        },
    });
};

export const useDeleteExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (index: number) => deleteExpenseApi(index),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-details"] });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            console.error("Failed to delete expense:", error);
            toast.error(error?.response?.data?.message || "Something went wrong while deleting the expense");
        },
    });
};

