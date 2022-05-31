import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContributedValue } from '../domain/contributedValue';
import { DomainId } from '../domain/domainId';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueMap } from '../mappers/contributedValueMap';

export interface IContributedValueRepo {
    findById(contributedValueId: DomainId | number): Promise<ContributedValue>;
    findByExpertiseScopeAndValueStream(
        expertiseScopeId: DomainId | number,
        valueStreamId: DomainId | number,
    ): Promise<ContributedValue>;
    findOne(
        valueStreamId: number,
        expertiseScopeId: number,
    ): Promise<ContributedValue>;
    findAll(): Promise<ContributedValue[]>;
}

@Injectable()
export class ContributedValueRepository implements IContributedValueRepo {
    constructor(
        @InjectRepository(ContributedValueEntity)
        protected repo: Repository<ContributedValueEntity>,
    ) {}
    async findOne(
        valueStreamId?: number,
        expertiseScopeId?: number,
    ): Promise<ContributedValue> {
        const entity = await this.repo.findOne({
            where: {
                valueStream: { id: valueStreamId },
                expertiseScope: { id: expertiseScopeId },
            },
            relations: ['expertiseScope', 'valueStream'],
        });
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }

    async findById(
        contributedValueId: DomainId | number,
    ): Promise<ContributedValue> {
        contributedValueId =
            contributedValueId instanceof DomainId
                ? Number(contributedValueId.id.toValue())
                : contributedValueId;
        const entity = await this.repo.findOne(contributedValueId, {
            relations: ['expertiseScope', 'valueStream'],
        });
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }

    async findByExpertiseScopeAndValueStream(
        expertiseScopeId: DomainId | number,
        valueStreamId: DomainId | number,
    ): Promise<ContributedValue> {
        expertiseScopeId =
            expertiseScopeId instanceof DomainId
                ? Number(expertiseScopeId.id.toValue())
                : expertiseScopeId;
        valueStreamId =
            valueStreamId instanceof DomainId
                ? Number(valueStreamId.id.toValue())
                : valueStreamId;

        const entity = await this.repo.findOne({
            where: {
                expertiseScope: { id: expertiseScopeId },
                valueStream: { id: valueStreamId },
            },
            join: {
                alias: 'contributed_value',
                leftJoinAndSelect: {
                    expertiseScope: 'contributed_value.expertiseScope',
                    valueStream: 'contributed_value.valueStream',
                },
            },
        });
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }
    async find(): Promise<ContributedValue> {
        const entity = await this.repo.findOne();
        return entity ? ContributedValueMap.toDomain(entity) : null;
    }

    async findAll(): Promise<ContributedValue[]> {
        const entity = await this.repo.find({
            relations: ['expertiseScope', 'valueStream'],
            order: {
                valueStream: 'ASC',
            },
        });

        return entity ? ContributedValueMap.toDomainAll(entity) : null;
    }

    async findByElement(
        valueStreamId: number,
        expertiseScopeId: number,
    ): Promise<ContributedValue> {
        const contribute = await this.repo.findOne({
            where: {
                valueStream: { id: valueStreamId },
                expertiseScope: { id: expertiseScopeId },
            },
        });
        return contribute ? ContributedValueMap.toDomain(contribute) : null;
    }
}
