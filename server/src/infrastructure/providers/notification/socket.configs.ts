import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "../logger/pino.logger";
import { NotificationPayload } from "@application/interfaces/services/notification/notification-service.interface";

let io: Server | null = null;

export const InitSocketConfigs = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: true,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        try {
            let token = socket.handshake.auth?.token;

            if (!token && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                token = cookies["accessToken"];
            }

            if (!token) {
                socket.disconnect();
                return;
            }

            const payload = jwt.verify(
                token,
                env.ACCESS_SECRET!
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
            console.error("Socket authentication failed", error);
            socket.disconnect();
        }
    });

    logger.info("Socket.IO initialized");
};


export const emitNotificationToUser = (userId: string, payload: NotificationPayload,) => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    io.to(userId).emit("notification", payload);
};