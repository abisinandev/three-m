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

        let purchasedQuantityOrUnits = 0;
        let investedAmount = 0;

        if (assetType === AssetType.STOCK) {

            purchasedQuantityOrUnits = amount;
            investedAmount = amount * price;

        } else if (assetType === AssetType.MUTUAL_FUND) {

            purchasedQuantityOrUnits = amount / price;
            investedAmount = amount;

        } else {

            throw new Error(`Unsupported asset type: ${assetType}`);
        }


        if (!portfolio) {

            portfolio = PortfolioEntity.create({
                userId,
                assetId,
                assetType,

                quantity: assetType === AssetType.STOCK ? purchasedQuantityOrUnits : undefined,
                units: assetType === AssetType.MUTUAL_FUND ? purchasedQuantityOrUnits : undefined,
                avgPrice: price,
                investedAmount,

            });

            await this._portfolioRepository.create(
                portfolio,
                session
            );

            return;
        }

        const newTotalInvested = portfolio.investedAmount + investedAmount;

        if (assetType === AssetType.STOCK) {

            const currentQuantity = portfolio.quantity ?? 0;

            const newQuantity = currentQuantity + purchasedQuantityOrUnits;

            const newAvgPrice = newTotalInvested / newQuantity;

            portfolio.updateQuantityAndPrice(
                newQuantity,
                newAvgPrice,
                newTotalInvested,
            );
        } else if (assetType === AssetType.MUTUAL_FUND) {

            const currentUnits =
                portfolio.units ?? 0;

            const newUnits =
                currentUnits + purchasedQuantityOrUnits;

            const newAvgPrice =
                newTotalInvested / newUnits;

            portfolio.updateQuantityAndPrice(
                newUnits,
                newAvgPrice,
                newTotalInvested
            );
        }

        await this._portfolioRepository.update(
            portfolio.id as string,
            {
                quantity: portfolio.quantity,
                units: portfolio.units,
                avgPrice: portfolio.avgPrice,
                investedAmount: portfolio.investedAmount
            },
            session
        );
    }

    async reduceOrUpdatePortfolio(
        userId: string,
        assetId: string,
        quantity: number,
        session: ClientSession
    ): Promise<void> {
        const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(userId, assetId, session);
        if (!portfolio) return;

        const newQuantity = (portfolio.quantity ?? 0) - quantity;

        if (newQuantity <= 0) {
            portfolio.closePortfolio();
        } else {
            const costOfSharesSold = portfolio.avgPrice * quantity;
            const newInvestedAmount = portfolio.investedAmount - costOfSharesSold;
            portfolio.updateQuantityAndPrice(newQuantity, portfolio.avgPrice, newInvestedAmount);
        }
        await this._portfolioRepository.update(portfolio.id as string, portfolio, session);
    }
}
