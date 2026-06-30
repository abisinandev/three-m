import { NotificationData, NotificationType } from "./enums/notification-type.enums";

const NOTIFICATION_TTL_DAYS = 7;

export class NotificationEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _type: NotificationType;
    private readonly _title: string;
    private readonly _message: string;
    private readonly _read: boolean;
    private readonly _createdAt: string;
    private readonly _expiresAt: Date;
    private readonly _data?: NotificationData;

    private constructor(props: {
        id?: string;
        userId: string;
        type: NotificationType;
        title?: string;
        message?: string;
        read?: boolean;
        createdAt?: string;
        expiresAt?: Date;
        data?: NotificationData;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._type = props.type;
        this._title = props.title ?? "";
        this._message = props.message ?? "";
        this._read = props.read ?? false;
        this._createdAt = props.createdAt ?? new Date().toISOString();
        this._expiresAt = props.expiresAt ?? NotificationEntity.defaultExpiresAt();
        this._data = props.data;
    }

    private static defaultExpiresAt(): Date {
        const date = new Date();
        date.setDate(date.getDate() + NOTIFICATION_TTL_DAYS);
        return date;
    }

    static create(props: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data?: NotificationData;
    }): NotificationEntity {
        return new NotificationEntity({
            userId: props.userId,
            type: props.type,
            title: props.title,
            message: props.message,
            read: false,
            createdAt: new Date().toISOString(),
            expiresAt: NotificationEntity.defaultExpiresAt(),
            data: props.data
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
        expiresAt?: Date;
        data?: NotificationData;
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

    get expiresAt() {
        return this._expiresAt;
    }

    get data() {
        return this._data;
    }

    toJSON() {
        return {
            id: this._id,
            type: this._type,
            title: this._title,
            message: this._message,
            read: this._read,
            createdAt: this._createdAt,
            data: this._data
        };
    }
}
