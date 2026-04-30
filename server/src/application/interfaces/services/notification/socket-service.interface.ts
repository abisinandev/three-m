import http from "http";
import { NotificationPayload } from "./notification-service.interface";
import { Trade } from "@application/dto/stocks/stock.dto";

export interface ISocketService {

    init(server: http.Server): void;

    emitNotificationToUser(userId: string, payload: NotificationPayload): void;

    emitStockUpdate(trade: Trade): void;
}
