import { SYSTEM } from '../../../common/constants/system';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Notification } from '../domain/notification';
import { NotificationEntity } from '../infra/database/entities';
import { NotificationDto } from '../infra/dtos/notification/getNotifications/getNotification.dto';
import { UserMap } from './userMap';

export class NotificationMap implements Mapper<Notification> {
    public static fromDomain(notification: Notification): NotificationDto {
        const notificationDto = new NotificationDto();
        notificationDto.id = Number(notification.id);
        notificationDto.notificationMessage =
            notification.props.notificationMessage;
        notificationDto.read = notification.props.read;
        notificationDto.createdAt = notification.props.createdAt;

        return notificationDto;
    }

    public static toDomain(raw: NotificationEntity): Notification {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const notificationOrError = Notification.create(
            {
                notificationMessage: raw.message,
                read: raw.read,
                user: UserMap.toDomain(raw.user),
                createdAt: raw.createdAt,
                updatedBy: SYSTEM,
            },
            new UniqueEntityID(id),
        );
        return notificationOrError.isSuccess
            ? notificationOrError.getValue()
            : null;
    }
    public static toEntity(notification: Notification): NotificationEntity {
        const id = Number(notification.id?.toValue()) || null;
        const notificationEntity = new NotificationEntity(id);
        notificationEntity.message = notification.notificationMessage;
        notificationEntity.read = notification.read;
        notificationEntity.user = UserMap.toEntity(notification.user);
        notificationEntity.createdBy = notification.createdBy;
        notificationEntity.createdAt = notification.createdAt;
        notificationEntity.updatedBy = SYSTEM;
        return notificationEntity;
    }

    public static toArrayDomain(
        notifications: NotificationEntity[],
    ): Notification[] {
        const listNotifications = new Array<Notification>();
        notifications.forEach((notification) => {
            const notificationsOrError = NotificationMap.toDomain(notification);
            if (notificationsOrError) {
                listNotifications.push(notificationsOrError);
            } else {
                return null;
            }
        });

        return listNotifications;
    }
}
