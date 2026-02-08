import mongoose, { Schema } from "mongoose";
import { NotificationDocument } from "../../interfaces/notification/notification-schema.interface";

const notificationSchema = new Schema<NotificationDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
        enum: ["EXPENSE", "WALLET", "SIP"],
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const NotificationModel = mongoose.model("Notification", notificationSchema);
