import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getRedeemableInvestments } from '@/shared/services/portfolio/portfolio-api';
import type { IRedeemedInvestment } from '@shared/types/portfolio.types';
import api from '@lib/axiosUser';
import { API_ROUTES } from '@shared/constants/apiRoutes';

export const useRedeem = () => {
    const { data: investments = [], isLoading: loading, refetch } = useQuery<IRedeemedInvestment[]>({
        queryKey: ['redeemable-investments'],
        queryFn: getRedeemableInvestments,
        staleTime: 5 * 60 * 1000,
    });

    const [selectedFund, setSelectedFund] = useState<IRedeemedInvestment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [redeemType, setRedeemType] = useState<'full' | 'partial'>('full');
    const [redeemAmount, setRedeemAmount] = useState('');
    const [redeemUnits, setRedeemUnits] = useState('');
    const [confirmStep, setConfirmStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
    const [redeemMode, setRedeemMode] = useState<'amount' | 'units'>('amount');

    const openRedeemModal = (fund: IRedeemedInvestment) => {
        setSelectedFund(fund);
        setRedeemType('full');
        setConfirmStep('input');
        setRedeemAmount('');
        setRedeemUnits('');
        setIsModalOpen(true);
    };

    const closeRedeemModal = () => {
        setIsModalOpen(false);
        setSelectedFund(null);
    };

    const mutateRedeem = useMutation({
        mutationFn: async (payload: { schemeCode: string, amount: number | string, units: number | string }) =>
            await api.patch(API_ROUTES.USER.PORTFOLIO.CONFIRM_REDEEM, payload),
        onSuccess: () => {
            setConfirmStep('success');
            refetch();
        },
        onError: () => {
            setConfirmStep('input');
        },
    });

    const handleRedeemConfirm = async () => {
        if (!selectedFund) return;
        setConfirmStep('processing');
        mutateRedeem.mutate({
            schemeCode: selectedFund.schemeCode,
            amount: redeemType === 'full' ? selectedFund.currentValue : redeemAmount,
            units: redeemType === 'full' ? selectedFund.totalUnits : redeemUnits,
        });
    };

    const estimatedRedeemValue = useMemo(() => {
        if (!selectedFund) return 0;
        if (redeemType === 'full') return selectedFund.currentValue;
        return redeemMode === 'amount' ? (Number(redeemAmount) || 0) : ((Number(redeemUnits) * selectedFund.nav) || 0);
    }, [selectedFund, redeemType, redeemMode, redeemAmount, redeemUnits]);

    const isValidRedemption = useMemo(() => {
        if (!selectedFund) return false;
        if (redeemType === 'full') return true;
        if (redeemMode === 'amount') {
            const amt = Number(redeemAmount);
            return amt >= 100 && amt <= selectedFund.currentValue;
        } else {
            const units = Number(redeemUnits);
            return units > 0 && units <= selectedFund.totalUnits;
        }
    }, [selectedFund, redeemType, redeemMode, redeemAmount, redeemUnits]);

    return {
        investments,
        loading,
        selectedFund,

        isModalOpen,
        redeemType,
        redeemAmount,
        redeemUnits,
        redeemMode,
        confirmStep,

        estimatedRedeemValue,
        isValidRedemption,

        openRedeemModal,
        closeRedeemModal,
        setRedeemType,
        setRedeemAmount,
        setRedeemUnits,
        setRedeemMode,
        handleRedeemConfirm,
    };
};
