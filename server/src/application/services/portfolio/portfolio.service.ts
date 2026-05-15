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
        session: ClientSession,
        riskLevels?: { stopLoss?: number | null, takeProfit?: number | null }
    ): Promise<void> {
        let portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
            userId,
            assetId,
            session
        );

        const quantityOrUnits = assetType === AssetType.STOCK ? amount : amount / price;
        
        if (!portfolio) {
            portfolio = PortfolioEntity.create({
                userId,
                assetId,
                assetType,
                quantity: assetType === AssetType.STOCK ? quantityOrUnits : undefined,
                units: assetType === AssetType.MUTUAL_FUND ? quantityOrUnits : undefined,
                avgPrice: price,
                investedAmount: assetType === AssetType.STOCK ? (quantityOrUnits * price) : amount,
            });

            if (riskLevels) {
                portfolio.updateRiskLevels(riskLevels.stopLoss, riskLevels.takeProfit);
            }

            await this._portfolioRepository.create(portfolio, session);
        } else {
            const currentQty = assetType === AssetType.STOCK ? (portfolio.quantity ?? 0) : (portfolio.units ?? 0);
            const newTotalQuantity = currentQty + quantityOrUnits;

            const addedInvestment = assetType === AssetType.STOCK ? (quantityOrUnits * price) : amount;
            const newTotalInvested = portfolio.investedAmount + addedInvestment;
            const newAvgPrice = newTotalInvested / newTotalQuantity;

            portfolio.updateQuantityAndPrice(newTotalQuantity, newAvgPrice, newTotalInvested);

            if (riskLevels) {
                portfolio.updateRiskLevels(riskLevels.stopLoss, riskLevels.takeProfit);
            }

            await this._portfolioRepository.update(portfolio.id as string, portfolio, session);
        }
    }

    async decreaseOrDeletePortfolio(
        userId: string,
        assetId: string,
        quantity: number,
        session: ClientSession
    ): Promise<void> {
        const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(userId, assetId, session);
        if (!portfolio) return;

        const newQuantity = (portfolio.quantity ?? 0) - quantity;

        if (newQuantity <= 0) {
            await this._portfolioRepository.deleteByUserIdAndSymbol(userId, assetId, session);
        } else {
            const costOfSharesSold = portfolio.avgPrice * quantity;
            const newInvestedAmount = portfolio.investedAmount - costOfSharesSold;
            portfolio.updateQuantityAndPrice(newQuantity, portfolio.avgPrice, newInvestedAmount);
            await this._portfolioRepository.update(portfolio.id as string, portfolio, session);
        }
    }
}
