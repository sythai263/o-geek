import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ContributedValueEntity } from './contributedValue.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'planned_workload' })
@Check('CHK_PLANNED_WORKLOAD', '"planned_workload" >= 0')
export class PlannedWorkloadEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, (user) => user.plannedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.plannedWorkloads,
    )
    @JoinColumn({
        name: 'contributed_value_id',
    })
    contributedValue: ContributedValueEntity;

    @ManyToOne(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.plannedWorkloads,
    )
    @JoinColumn({
        name: 'committed_workload_id',
    })
    committedWorkload: CommittedWorkloadEntity;

    @Column({
        type: 'decimal',
        nullable: false,
        name: 'planned_workload',
        precision: 4,
        scale: 2,
        transformer: {
            to(value: number): number {
                return value;
            },
            from(value: string): number {
                return parseFloat(value);
            },
        },
    })
    plannedWorkload: number;

    @Column({
        nullable: false,
        name: 'start_date',
        type: 'timestamp with time zone',
    })
    startDate: Date;

    @Column({
        nullable: false,
        name: 'status',
        type: 'enum',
        enum: PlannedWorkloadStatus,
        default: PlannedWorkloadStatus.PLANNING,
    })
    status: PlannedWorkloadStatus;

    @Column({
        name: 'reason',
    })
    reason: string;

    constructor(
        id?: number,
        user?: UserEntity,
        contributedValue?: ContributedValueEntity,
        committedWorkload?: CommittedWorkloadEntity,
        plannedWorkload?: number,
        startDate?: Date,
        reason?: string,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.user = user;
        this.contributedValue = contributedValue;
        this.committedWorkload = committedWorkload;
        this.plannedWorkload = plannedWorkload;
        this.startDate = startDate;
        this.reason = reason;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
