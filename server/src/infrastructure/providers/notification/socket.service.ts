import { Server } from "socket.io";
import http from "node:http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { injectable, inject } from "inversify";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "../logger/pino.logger";
import { ISocketService } from "@application/interfaces/services/notification/socket-service.interface";
import { NotificationPayload } from "@application/interfaces/services/notification/notification-service.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { WsGateway } from "@presentation/express/websocket/ws.gateway";
import { MarketDataService } from "@infrastructure/providers/stocks/market-data.service";

@injectable()
export class SocketService implements ISocketService {
    private io: Server | null = null;

    constructor(
        @inject(STOCK_TYPES.WsGateway) private readonly _wsGateway: WsGateway,
        @inject(STOCK_TYPES.MarketDataService) private readonly _marketDataService: MarketDataService,
    ) { }

    init(server: http.Server): void {
        this.io = new Server(server, {
            cors: {
                origin: true,
                credentials: true,
            },
        });

        this.io.on("connection", (socket) => {
            try {
                let token = socket.handshake.auth?.token;

                if (!token && socket.handshake.headers.cookie) {
                    const cookies = cookie.parse(socket.handshake.headers.cookie);
                    token = cookies.accessToken;
                }

                if (!token) {
                    socket.disconnect();
                    return;
                }

                const payload = jwt.verify(
                    token,
                    env.ACCESS_SECRET as string
                ) as { id: string };

                const userId = payload.id;
                if (!userId) {
                    socket.disconnect();
                    return;
                }

                socket.join(userId);
                logger.info(
                    `Socket connected | user=${userId} | socketId=${socket.id}`
                );

                socket.on("disconnect", (reason) => {
                    logger.info(
                        `Socket disconnected | user=${userId} | reason=${reason}`
                    );
                });
            } catch (error) {
                logger.error({ err: error }, "Socket authentication failed");
                socket.disconnect();
            }
        });

        logger.info("Socket.io initialized successfully via SocketService");

        this._wsGateway.init(this.io, this._marketDataService);
    }

    emitNotificationToUser(userId: string, payload: NotificationPayload): void {
        if (!this.io) {
            logger.warn("Attempted to emit notification before Socket.io was initialized");
            return;
        }

        this.io.to(userId).emit("notification", payload);
    }

    emitStockUpdate(trade: unknown): void {
        if (this.io) {
            this.io.emit("stock-update", trade);
        }
    }
}
