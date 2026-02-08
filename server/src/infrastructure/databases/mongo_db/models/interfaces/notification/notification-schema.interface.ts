import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { Document, Types } from "mongoose";

export interface NotificationDocument extends Document {
    _id: Types.ObjectId,
    userId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}
