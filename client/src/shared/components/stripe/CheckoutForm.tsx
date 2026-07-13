import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";

const CheckoutForm = ({ loading, setLoading }: { loading: boolean; setLoading: (l: boolean) => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const url = import.meta.env.VITE_FRONTEND_URL

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${url}/user/payment-success`,
            },
        });

        if (error) {
            toast.error(error.message ?? "Payment failed");
            setLoading(false);
        }

    };

    return (
        <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-5">
            <PaymentElement />
            <button
                onClick={handleSubmit}
                disabled={loading || !stripe || !elements}
                className="mt-5 w-full py-3 rounded-xl bg-green-600"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default CheckoutForm