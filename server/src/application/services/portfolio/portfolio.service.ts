import { IPortfolioService } from "./interfaces/portfolio.service.interface";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { ClientSession } from "mongoose";
import { inject, injectable } from "inversify";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";

@injectable()
export class PortfolioService implements IPortfolioService {
    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository
    ) { }

    async updateOrCreatePortfolio(
        userId: string,
        assetId: string,
        assetType: AssetType,
        amount: number,
        price: number,
        session: ClientSession
    ): Promise<void> {
        let portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
            userId,
            assetId,
            session
        );

        if (!portfolio) {
            portfolio = PortfolioEntity.create({
                userId,
                assetId,
                assetType,
                units: amount / price,
                avgPrice: price,
                investedAmount: amount,
            });
            await this._portfolioRepository.create(portfolio, session);
        } else {
            const newTotalInvested = portfolio.investedAmount + amount;
            const investmentUnits = amount / price;
            const newUnits = (portfolio.units ?? 0) + investmentUnits;
            const newAvgPrice = price;

            portfolio.updateQuantityAndPrice(newUnits, newAvgPrice, newTotalInvested);

            await this._portfolioRepository.update(portfolio.id as string, portfolio, session);
        }
    }
}
