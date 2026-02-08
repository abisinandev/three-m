import { randomUUID } from "crypto";
import { NotificationType } from "./enums/notification-type.enums";

export class NotificationEntity {
    private readonly _id: string;
    private readonly _userId: string;
    private readonly _type: NotificationType;
    private readonly _title: string;
    private readonly _message: string;
    private readonly _read: boolean;
    private readonly _createdAt: string;

    private constructor(props: {
        id: string;
        userId: string;
        type: NotificationType;
        title?: string;
        message?: string;
        read?: boolean;
        createdAt?: string;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._type = props.type;
        this._title = props.title ?? "";
        this._message = props.message ?? "";
        this._read = props.read ?? false;
        this._createdAt = props.createdAt ?? new Date().toISOString();
    }

    static create(props: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
    }): NotificationEntity {
        return new NotificationEntity({
            id: randomUUID(),
            userId: props.userId,
            type: props.type,
            title: props.title,
            message: props.message,
            read: false,
            createdAt: new Date().toISOString(),
        });
    }

    static fromPersistence(props: {
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }): NotificationEntity {
        return new NotificationEntity(props);
    }

    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get type() {
        return this._type;
    }

    get title() {
        return this._title;
    }

    get message() {
        return this._message;
    }

    get read() {
        return this._read;
    }

    get createdAt() {
        return this._createdAt;
    }
}
