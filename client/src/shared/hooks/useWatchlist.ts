import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchWatchlistApi, AddToWatchlistApi, RemoveFromWatchlistApi } from '@/shared/services/stock/watchlist-api';
import { toast } from 'sonner';

export const useGetWatchlist = () => {
    return useQuery({
        queryKey: ['user-watchlist'],
        queryFn: FetchWatchlistApi,
    });
};

export const useWatchlistMutation = (onUpgradeRequired?: () => void) => {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: AddToWatchlistApi,
        onSuccess: (data) => {
            if (data?.data?.upgrade) {
                onUpgradeRequired?.();
            } else {
                toast.success('Added to watchlist');
                queryClient.invalidateQueries({ queryKey: ['user-watchlist'] });
            }
        },
        onError: (error: unknown) => {
            toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to add to watchlist');
        }
    });

    const removeMutation = useMutation({
        mutationFn: RemoveFromWatchlistApi,
        onSuccess: () => {
            toast.success('Removed from watchlist');
            queryClient.invalidateQueries({ queryKey: ['user-watchlist'] });
        },
        onError: (error: unknown) => {
            toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to remove from watchlist');
        }
    });

    return {
        add: addMutation.mutate,
        remove: removeMutation.mutate,
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending
    };
};
