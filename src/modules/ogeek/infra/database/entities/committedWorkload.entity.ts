import {
    Check,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { ContributedValueEntity } from './contributedValue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'committed_workload' })
@Check('CHK_START_DATE_COMMITTED_WORKLOAD', '"start_date" < "expired_date"')
@Check('CHK_COMMITTED_WORKLOAD', '"committed_workload" >= 0')
export class CommittedWorkloadEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, (user) => user.committedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.committedWorkloads,
    )
    @JoinColumn({
        name: 'contributed_value_id',
    })
    contributedValue: ContributedValueEntity;

    @Column({
        nullable: false,
        name: 'committed_workload',
    })
    committedWorkload: number;

    @Column({
        nullable: false,
        name: 'start_date',
        type: 'timestamp with time zone',
    })
    startDate: Date;

    @Column({
        default: CommittedWorkloadStatus.ACTIVE,
        name: 'status',
    })
    status: CommittedWorkloadStatus;

    @Column({
        nullable: false,
        name: 'expired_date',
        type: 'timestamp with time zone',
    })
    expiredDate: Date;

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.committedWorkload,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    constructor(
        id?: number,
        user?: UserEntity,
        contributedValue?: ContributedValueEntity,
        committedWorkload?: number,
        startDate?: Date,
        expiredDate?: Date,
        status?: CommittedWorkloadStatus,
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
        this.startDate = startDate;
        this.expiredDate = expiredDate;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
