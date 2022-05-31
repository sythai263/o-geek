import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { ExpertiseScopeEntity } from './expertiseScope.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { ValueStreamEntity } from './valueStream.entity';

@Entity({ name: 'contributed_value' })
export class ContributedValueEntity extends AbstractEntity {
    @ManyToOne(
        () => ExpertiseScopeEntity,
        (expertiseScope) => expertiseScope.contributedValues,
    )
    @JoinColumn({
        name: 'expertise_scope_id',
    })
    expertiseScope: ExpertiseScopeEntity;

    @ManyToOne(
        () => ValueStreamEntity,
        (valueStream) => valueStream.contributedValues,
    )
    @JoinColumn({
        name: 'value_stream_id',
    })
    valueStream: ValueStreamEntity;

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.contributedValue,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.contributedValue,
    )
    committedWorkloads: CommittedWorkloadEntity[];

    constructor(
        id?: number,
        valueStream?: ValueStreamEntity,
        expertiseScope?: ExpertiseScopeEntity,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.valueStream = valueStream;
        this.expertiseScope = expertiseScope;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
