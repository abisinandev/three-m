
import { CheckCircle } from 'lucide-react';
import type { FundDetails } from '../../../types/MutaulFundType';

interface SuccessModalProps {
    data: FundDetails;
    investment: number;
    onClose: () => void;
}

export const SuccessModal = ({ data, investment, onClose }: SuccessModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl w-full max-w-md shadow-2xl p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Investment Successful!</h3>
                <p className="text-gray-400 mb-6">
                    ₹{investment.toLocaleString('en-IN')} invested in {data.schemeName}
                </p>
                <button
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-8 rounded-xl"
                >
                    Done
                </button>
            </div>
        </div>
    );
};
