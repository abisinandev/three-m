import type { InvestmentPayload } from "@/modules/user/mutual-fund/types/mutual-fund.types";
import SHA256 from "crypto-js/sha256";

export const createIdempotencyKey = (
    payload: InvestmentPayload
): string => {

    return SHA256(
        JSON.stringify({
            schemeCode: payload.schemeCode,
            amount: payload.amount,
            units: payload.units,
            paymentMethod: payload.paymentMethod,
            investmentType: payload.investmentType
        })
    ).toString();
};