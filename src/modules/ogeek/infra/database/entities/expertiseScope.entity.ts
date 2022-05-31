import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { ContributedValueEntity } from './contributedValue.entity';

@Entity({ name: 'expertise_scope' })
export class ExpertiseScopeEntity extends AbstractEntity {
    @Column({
        nullable: false,
        name: 'name',
    })
    name: string;

    @OneToMany(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.expertiseScope,
    )
    contributedValues: ContributedValueEntity[];

    constructor(
        id?: number,
        name?: string,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.name = name;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
