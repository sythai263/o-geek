import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainId } from '../domain/domainId';
import { Notification } from '../domain/notification';
import { NotificationEntity } from '../infra/database/entities/notification.entity';
import { NotificationMap } from '../mappers/notificationMap';

export interface INotificationRepo {
    findByUserId(userId: DomainId | number): Promise<Notification[]>;
    findById(notificationId: DomainId | number): Promise<Notification>;
    save(notificationEntity: NotificationEntity): Promise<Notification>;
}

@Injectable()
export class NotificationRepository implements INotificationRepo {
    constructor(
        @InjectRepository(NotificationEntity)
        protected repo: Repository<NotificationEntity>,
    ) {}

    async findByUserId(userId: DomainId | number): Promise<Notification[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                user: { id: userId },
            },
            relations: ['user'],
        });
        return entities
            ? NotificationMap.toArrayDomain(entities)
            : new Array<Notification>();
    }

    async findById(notificationId: DomainId | number): Promise<Notification> {
        notificationId =
            notificationId instanceof DomainId
                ? Number(notificationId.id.toValue())
                : notificationId;
        const entity = await this.repo.findOne({
            where: {
                id: notificationId,
            },
            relations: ['user'],
        });
        return entity ? NotificationMap.toDomain(entity) : null;
    }

    async save(notificationEntity: NotificationEntity): Promise<Notification> {
        const entity = await this.repo.save(notificationEntity);

        return entity ? NotificationMap.toDomain(entity) : null;
    }
}
