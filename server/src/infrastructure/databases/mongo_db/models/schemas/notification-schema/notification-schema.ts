import mongoose, { Schema } from "mongoose";
import { NotificationDocument } from "../../interfaces/notification/notification-schema.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

const notificationSchema = new Schema<NotificationDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationType),
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    data: {
        type: Schema.Types.Mixed,
        required: false,
    },
});

notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const NotificationModel = mongoose.model("Notification", notificationSchema);
