import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { inject, injectable } from "inversify";
import { IMfInvestmentHistoryUseCase } from "./interfaces/mf-investment-history-usecase.interface";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class MfInvestmentHistoryUseCase implements IMfInvestmentHistoryUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(userId: string): Promise<InvestmentResponseDTO[]> {
        const investments =
            (await this._investmentRepository.findInvestmentsByUser(userId)) ?? [];

        const grouped: InvestmentResponseDTO[] = [];

        for (const invest of investments) {
            grouped.push({
                id: invest.id,
                userId: invest.userId,
                schemeCode: invest.schemeCode,

                amount: invest.amount,
                units: invest.units,

                nav: invest.nav,
                navDate: invest.navDate,
                status: invest.status,
                paymentMethod: invest.paymentMethod,
                investmentType: invest.investmentType,

                profit: invest.amount,
                createdAt: invest.createdAt,
                updatedAt: invest.updatedAt,
                category: "",
                logo: "",
                schemeName:""
            });
        }

        return grouped;
    }

}