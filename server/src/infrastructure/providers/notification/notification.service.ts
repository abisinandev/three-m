import { injectable } from "inversify";
import { getIO } from "./socket";
import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";

@injectable()
export class SocketNotificationService implements INotificationService {
  send(userId: string, payload: { title?: string; message: string; meta?: any }): void {
    const io = getIO();
    io.to(userId).emit("notification", {
      ...payload,
      createdAt: new Date().toISOString(),
    });
  }
}