import http from "http";
import { NotificationPayload } from "./notification-service.interface";

export interface ISocketService {

    init(server: http.Server): void;

    emitNotificationToUser(userId: string, payload: NotificationPayload): void;

    emitStockUpdate(trade: any): void;
}
