import { Response } from "express";

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export class ResponseHelper {
    static success<T>(
        res: Response,
        message: string,
        data?: T,
        statusCode = 200
    ) {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
        };

        return res.status(statusCode).json(response);
    }

    static failure(
        res: Response,
        message: string,
        statusCode = 400
    ) {
        const response: ApiResponse<null> = {
            success: false,
            message,
        };

        return res.status(statusCode).json(response);
    }
}