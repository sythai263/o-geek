import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationStatus } from '../../../../../common/constants/notificationStatus';
import { SYSTEM } from '../../../../../common/constants/system';
import { Notification } from '../../../../ogeek/domain/notification';
import { NotificationMap } from '../../../mappers/notificationMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { INotificationRepo } from '../../../repos/notificationRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { CommittedWorkloadCreatedEvent } from '../events/CommittedWorkloadEvent';
@Injectable()
export class CommittedWorkloadCreatedListener {
    constructor(
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('INotificationRepo')
        public readonly notificationRepo: INotificationRepo,
    ) {}

    @OnEvent('committed-workload.created')
    async handleCommittedWorkloadCreatedEvent(
        committedEvent: CommittedWorkloadCreatedEvent,
    ): Promise<void> {
        for (const commit of committedEvent.committedWorkloads) {
            const plannedDomain = commit.autoGeneratePlanned();
            const plannedEntities =
                PlannedWorkloadMap.toEntities(plannedDomain);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }

        for (const oldCommit of committedEvent.oldCommittedWorkloads) {
            let plans = await this.plannedWorkloadRepo.findByCommittedId(
                oldCommit.id.toValue(),
                committedEvent.startDate,
            );

            if (plans) {
                plans = oldCommit.autoArchivePlannedWorkload(
                    committedEvent.startDate,
                    plans,
                );
                const plannedEntities = PlannedWorkloadMap.toEntities(plans);

                await this.plannedWorkloadRepo.createMany(plannedEntities);
            }
        }
        const committedWorkload = committedEvent.committedWorkloads.find(
            (committedWl) => committedWl,
        );
        const user = committedWorkload.user;
        const sumCommit = committedEvent.committedWorkloads.reduce(
            (prev, curr) => prev + curr.committedWorkload,
            0,
        );

        const notificationMessage = `Admin has added ${sumCommit} hr(s) committed workload for you.`;
        const notification = Notification.create({
            notificationMessage,
            user,
            read: NotificationStatus.UNREAD,
            createdBy: SYSTEM,
            updatedBy: SYSTEM,
        });

        const notificationEntity = NotificationMap.toEntity(
            notification.getValue(),
        );

        await this.notificationRepo.save(notificationEntity);
    }

    @OnEvent('committed-workload.updated')
    async handleCommittedWorkloadUpdatedEvent(
        committedEvent: CommittedWorkloadCreatedEvent,
    ): Promise<void> {
        for (const commit of committedEvent.committedWorkloads) {
            const plannedDomain = commit.autoGeneratePlanned();

            const plannedEntities =
                PlannedWorkloadMap.toEntities(plannedDomain);
            await this.plannedWorkloadRepo.createMany(plannedEntities);
        }

        for (const oldCommit of committedEvent.oldCommittedWorkloads) {
            let plans = await this.plannedWorkloadRepo.findByCommittedId(
                oldCommit.id.toValue(),
                committedEvent.startDate,
            );

            if (plans) {
                plans = oldCommit.autoArchivePlannedWorkload(
                    committedEvent.startDate,
                    plans,
                );
                const plannedEntities = PlannedWorkloadMap.toEntities(plans);

                await this.plannedWorkloadRepo.createMany(plannedEntities);
            }
        }

        const committedWorkload = committedEvent.committedWorkloads[0];
        const user = committedWorkload.user;
        const sumCommit = committedEvent.committedWorkloads.reduce(
            (prev, curr) => prev + curr.committedWorkload,
            0,
        );

        const notificationMessage = `Admin has updated ${sumCommit} hr(s) committed workload for you.`;
        const notification = Notification.create({
            notificationMessage,
            user,
            read: NotificationStatus.UNREAD,
            createdBy: SYSTEM,
            updatedBy: SYSTEM,
        });

        const notificationEntity = NotificationMap.toEntity(
            notification.getValue(),
        );

        await this.notificationRepo.save(notificationEntity);
    }
}
