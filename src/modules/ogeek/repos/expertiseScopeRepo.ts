import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { MomentService } from '../../../providers/moment.service';
import { DomainId } from '../domain/domainId';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { ExpertiseScopeMap } from '../mappers/expertiseScopeMap';

export interface IExpertiseScopeRepo {
    findById(expertiseScopeId: DomainId | number): Promise<ExpertiseScope>;
    findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<ExpertiseScope[]>;
    findByIdInPrecedingWeeks(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<ExpertiseScope[]>;
    findAll(): Promise<ExpertiseScope[]>;
}

@Injectable()
export class ExpertiseScopeRepository implements IExpertiseScopeRepo {
    constructor(
        @InjectRepository(ExpertiseScopeEntity)
        protected repo: Repository<ExpertiseScopeEntity>,
    ) {}

    async findById(
        expertiseScopeId: DomainId | number,
    ): Promise<ExpertiseScope> {
        expertiseScopeId =
            expertiseScopeId instanceof DomainId
                ? Number(expertiseScopeId.id.toValue())
                : expertiseScopeId;
        const entity = await this.repo.findOne(expertiseScopeId);
        return entity ? ExpertiseScopeMap.toDomain(entity) : null;
    }

    async findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<ExpertiseScope[]> {
        const entities = await this.repo.find({
            where: {
                user: userId,
                startDate:
                    MoreThanOrEqual(startDate) && LessThanOrEqual(startDate),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
            ],
        });
        return entities ? ExpertiseScopeMap.toDomainAll(entities) : null;
    }

    async findByIdInPrecedingWeeks(
        userId: DomainId | number,
        startDate: Date,
    ): Promise<ExpertiseScope[]> {
        const entities = await this.repo.find({
            where: {
                user: userId,
                startDate: MoreThanOrEqual(
                    MomentService.shiftFirstDateChart(startDate),
                ),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
            ],
        });
        return entities ? ExpertiseScopeMap.toDomainAll(entities) : null;
    }

    async findAll(): Promise<ExpertiseScope[]> {
        const entities = await this.repo.find();
        return entities ? ExpertiseScopeMap.toDomainAll(entities) : null;
    }
}
