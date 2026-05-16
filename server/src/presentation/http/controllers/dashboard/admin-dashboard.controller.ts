import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { DASHBOARD_TYPES } from "@infrastructure/inversify_di/features/dashboard/dashboard.types";
import { IAdminDashboardUseCase } from "@application/use_cases/admin/dashboard/admin-dashboard-usecase.interface";

@injectable()
export class AdminDashboardController {
    constructor(
        @inject(DASHBOARD_TYPES.AdminDashboardUseCase) private readonly _adminDashboardUseCase: IAdminDashboardUseCase
    ) { }

    getOverview = async (_req: Request, res: Response): Promise<void> => {
        try {
            const dashboardData = await this._adminDashboardUseCase.execute();
            res.status(200).json({
                success: true,
                message: "Admin dashboard overview fetched successfully",
                data: dashboardData
            });
        } catch (error) {
            console.error("Error fetching admin dashboard overview:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch admin dashboard overview",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}
