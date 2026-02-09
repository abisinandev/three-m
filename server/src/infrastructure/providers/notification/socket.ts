import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { logger } from "../logger/pino.logger";
import cookie from "cookie";
import { env } from "@presentation/express/utils/constants/env.constants";

let io: Server | null = null;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: true,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            if (!cookieHeader) {
                socket.disconnect();
                return;
            }


            const cookies = cookie.parse(cookieHeader);
            const token = cookies["accessToken"];
            if (!token) {
                socket.disconnect();
                return;
            }


            const payload = jwt.verify(token, env.ACCESS_SECRET!) as { userId: string };
            const userId = payload.userId;
            if (!userId) {
                socket.disconnect();
                return;
            }

            socket.join(userId);
            console.log(`Socket connected for user ${userId} (socketId=${socket.id})`);

            socket.on("disconnect", (reason) => {
                console.log(`Socket disconnected ${socket.id}: ${reason}`);
            });
        } catch (error) {
            console.log("Socket auth failed", error);
            socket.disconnect();
        }
    })
    
    console.log("Socket.IO initialized");
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
