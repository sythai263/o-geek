import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CheckNotificationDto } from '../../../../ogeek/infra/dtos/notification/checkNotification/checkNotification.dto';
import { NotificationMap } from '../../../../ogeek/mappers/notificationMap';
import { INotificationRepo } from '../../../../ogeek/repos/notificationRepo';
import { NotificationDto } from '../../../infra/dtos/notification/getNotifications/getNotification.dto';
import { IUserRepo } from '../../../repos/userRepo';
import { CheckNotificationErrors } from './CheckNotificationErrors';

type Response = Either<
    | AppError.UnexpectedError
    | CheckNotificationErrors.UserNotFound
    | CheckNotificationErrors.NotificationNotFound,
    Result<NotificationDto>
>;

@Injectable()
export class CheckNotificationUseCase
    implements IUseCase<CheckNotificationDto, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('INotificationRepo')
        public readonly notificationRepo: INotificationRepo,
    ) {}
    async execute(
        checkNotification: CheckNotificationDto,
        userId: number,
    ): Promise<Response> {
        try {
            const notificationId = checkNotification.id;
            const user = await this.userRepo.findById(userId);

            if (!user) {
                return left(new CheckNotificationErrors.UserNotFound(userId));
            }

            const notification = await this.notificationRepo.findById(
                notificationId,
            );
            if (!notification) {
                return left(
                    new CheckNotificationErrors.NotificationNotFound(
                        notificationId,
                    ),
                );
            }
            if (notification.isRead()) {
                const notificationDto =
                    NotificationMap.fromDomain(notification);
                return right(Result.ok(notificationDto));
            }
            notification.markRead();

            const notificationEntity = NotificationMap.toEntity(notification);
            await this.notificationRepo.save(notificationEntity);

            const notificationReadDto =
                NotificationMap.fromDomain(notification);
            return right(Result.ok(notificationReadDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
