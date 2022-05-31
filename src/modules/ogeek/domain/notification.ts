import { NotificationStatus } from '../../../common/constants/notificationStatus';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
import { User } from './user';

interface INotificationProps {
    notificationMessage?: string;
    read?: NotificationStatus;
    user?: User;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class Notification extends AggregateRoot<INotificationProps> {
    private constructor(props?: INotificationProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get notificationId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get notificationMessage(): string {
        return this.props.notificationMessage;
    }
    set notificationMessage(message: string) {
        this.props.notificationMessage = message;
    }
    get read(): NotificationStatus {
        return this.props.read;
    }
    set read(read: NotificationStatus) {
        this.props.read = read;
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    set createdAt(createdAt: Date) {
        this.props.createdAt = createdAt;
    }
    get updatedAt(): Date {
        return this.props.createdAt;
    }
    set updatedAt(updatedAt: Date) {
        this.props.updatedAt = updatedAt;
    }
    get deletedAt(): Date {
        return this.props.deletedAt;
    }
    set deletedAt(deletedAt: Date) {
        this.props.deletedAt = deletedAt;
    }
    get createdBy(): number {
        return this.props.createdBy;
    }
    set createdBy(createdBy: number) {
        this.props.createdBy = createdBy;
    }
    get updatedBy(): number {
        return this.props.createdBy;
    }
    set updatedBy(updatedBy: number) {
        this.props.updatedBy = updatedBy;
    }
    get deletedBy(): number {
        return this.props.createdBy;
    }
    set deletedBy(deletedBy: number) {
        this.props.deletedBy = deletedBy;
    }
    public isRead(): boolean {
        return this.props.read === NotificationStatus.READ;
    }

    public static create(
        props: INotificationProps,
        id?: UniqueEntityID,
    ): Result<Notification> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<Notification>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.user = props.user;
        const notification = new Notification(defaultValues, id);
        return Result.ok<Notification>(notification);
    }

    public markRead(): void {
        this.props.read = NotificationStatus.READ;
    }

    public static sortNotificationByTime(
        notifications: Notification[],
    ): Notification[] {
        return notifications.sort(
            (preNotification, curNotification) =>
                new Date(curNotification.props.createdAt).valueOf() -
                new Date(preNotification.props.createdAt).valueOf(),
        );
    }
}
