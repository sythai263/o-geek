import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { NotificationStatus } from '../../../../../common/constants/notificationStatus';
import { UserEntity } from './user.entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends AbstractEntity {
    @Column({
        name: 'message',
    })
    message: string;

    @Column({
        enum: NotificationStatus,
        name: 'read',
    })
    read: NotificationStatus;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    constructor(
        id?: number,
        message?: string,
        read?: NotificationStatus,
        user?: UserEntity,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.message = message;
        this.read = read;
        this.user = user;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
