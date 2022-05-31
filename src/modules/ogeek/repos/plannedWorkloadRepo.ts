import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Between,
    Connection,
    FindManyOptions,
    getConnection,
    LessThan,
    LessThanOrEqual,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';

import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { DomainId } from '../domain/domainId';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { FromWeekToWeekWLInputDto } from '../infra/dtos/getPotentialIssues/getCommittedWorkloadByIssue.dto';
import { InputGetPlanWLDto } from '../infra/dtos/valueStreamsByWeek/inputGetPlanWL.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { PlannedWorkloadMap } from '../mappers/plannedWorkloadMap';

export interface IPlannedWorkloadRepo {
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<PlannedWorkload[]>;
    findByUserIdOverview(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]>;
    findById(plannedWorkloadId: DomainId | number): Promise<PlannedWorkload>;
    findOne(condition: any): Promise<PlannedWorkload>;
    findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
        endDate: Date,
    ): Promise<PlannedWorkload[]>;
    findByUserId({
        userId,
        startDateOfWeek,
        endDateOfWeek,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]>;
    find(condition: any): Promise<PlannedWorkload[]>;
    getPlanWLNotClosed({
        startDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload>;
    create(entity: PlannedWorkloadEntity): Promise<PlannedWorkload>;
    createMany(entities: PlannedWorkloadEntity[]): Promise<PlannedWorkload[]>;
    updateOne(plannedWorkloadEntity: PlannedWorkloadEntity): Promise<void>;
    updateMany(plannedWorkloadEntity: PlannedWorkloadEntity[]): Promise<void>;
    update(plannedEntities: PlannedWorkloadEntity[]): Promise<void>;
    findByCommittedId(
        committedWorkloadId: string | number,
        startDate?: Date,
    ): Promise<PlannedWorkload[]>;
    findAllByWeekAndYear({
        startDateOfWeek,
        lastDateOfWeek,
    }: FromWeekToWeekWLInputDto): Promise<PlannedWorkload[]>;
}

@Injectable()
export class PlannedWorkloadRepository implements IPlannedWorkloadRepo {
    constructor(
        @InjectRepository(PlannedWorkloadEntity)
        protected repo: Repository<PlannedWorkloadEntity>,
        private _connection: Connection,
    ) {}

    async findByUserIdOverview(
        userId: DomainId | number,
        startDateOfYear: string,
        endDateOfYear: string,
    ): Promise<PlannedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.find({
            where: {
                user: { id: userId },
                startDate: Between(startDateOfYear, endDateOfYear),
                status: Not(PlannedWorkloadStatus.ARCHIVE.toString()),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'committedWorkload.user',
                'user',
            ],
        });
        return entity ? PlannedWorkloadMap.toArrayDomain(entity) : null;
    }

    async findById(
        plannedWorkloadId: DomainId | number,
    ): Promise<PlannedWorkload> {
        plannedWorkloadId =
            plannedWorkloadId instanceof DomainId
                ? Number(plannedWorkloadId.id.toValue())
                : plannedWorkloadId;
        const entity = await this.repo.findOne(plannedWorkloadId);
        return entity ? PlannedWorkloadMap.toDomain(entity) : null;
    }

    async create(entity: PlannedWorkloadEntity): Promise<PlannedWorkload> {
        const savedEntity = await this.repo.save(entity);
        return savedEntity ? PlannedWorkloadMap.toDomain(entity) : null;
    }

    async createMany(
        entities: PlannedWorkloadEntity[],
    ): Promise<PlannedWorkload[]> {
        const queryRunner = this._connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const plannedWorkloadEntities = await queryRunner.manager.save(
                PlannedWorkloadEntity,
                entities,
            );
            await queryRunner.commitTransaction();
            return plannedWorkloadEntities ||
                plannedWorkloadEntities.length === 0
                ? PlannedWorkloadMap.toDomainAll(plannedWorkloadEntities)
                : null;
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async findByUserId({
        startDateOfWeek,
        endDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                status: Not(PlannedWorkloadStatus.ARCHIVE.toString()),
                user: userId,
                startDate: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
    }

    async getPlanWLNotClosed({
        startDateOfWeek,
        userId,
    }: InputGetPlanWLDto): Promise<PlannedWorkload> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                status:
                    PlannedWorkloadStatus.EXECUTING ||
                    PlannedWorkloadStatus.PLANNING,
                user: userId,
                startDate: LessThan(startDateOfWeek),
            },
            order: { startDate: 'ASC' },
        });
        return entities ? PlannedWorkloadMap.toDomain(entities[0]) : null;
    }

    async find(condition: any): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: condition as FindManyOptions<PlannedWorkload>,
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomainAll(entities) : null;
    }

    async findOne(condition: any): Promise<PlannedWorkload> {
        const entities = await this.repo.findOne({
            where: condition as FindManyOptions<PlannedWorkload>,
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
                'committedWorkload.user',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomain(entities) : null;
    }

    async findByIdWithTimeRange(
        userId: DomainId | number,
        startDate: Date,
        endDate: Date,
    ): Promise<PlannedWorkload[]> {
        userId =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entities = await this.repo.find({
            where: {
                user: userId,
                startDate:
                    MoreThanOrEqual(startDate) && LessThanOrEqual(endDate),
                status: Not(PlannedWorkloadStatus.ARCHIVE.toString()),
            },

            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'committedWorkload',
            ],
        });
        return entities ? PlannedWorkloadMap.toDomainAll(entities) : null;
    }

    async updateOne(
        plannedWorkloadEntity: PlannedWorkloadEntity,
    ): Promise<void> {
        await this.repo.update(
            { id: plannedWorkloadEntity.id },
            plannedWorkloadEntity,
        );
    }

    async updateMany(
        plannedWorkloadEntities: PlannedWorkloadEntity[],
    ): Promise<void> {
        for (const plannedWLEntity of plannedWorkloadEntities) {
            await this.repo.update({ id: plannedWLEntity.id }, plannedWLEntity);
        }
    }

    async findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: Not(PlannedWorkloadStatus.ARCHIVE.toString()),
                startDate: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.user',
                'user',
            ],
        });

        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
    }
    async findAllByWeekAndYear({
        startDateOfWeek,
        lastDateOfWeek,
    }: FromWeekToWeekWLInputDto): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                status: Not(PlannedWorkloadStatus.ARCHIVE.toString()),
                startDate: Between(startDateOfWeek, lastDateOfWeek),
            },
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.user',
                'user',
            ],
        });

        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
    }

    async findByCommittedId(
        committedWorkloadId: string | number,
        startDate?: Date,
    ): Promise<PlannedWorkload[]> {
        const entities = await this.repo.find({
            where: {
                committedWorkload: {
                    id: committedWorkloadId,
                },
                startDate: MoreThanOrEqual(startDate),
            },
            loadEagerRelations: true,
            relations: [
                'contributedValue',
                'contributedValue.expertiseScope',
                'contributedValue.valueStream',
                'committedWorkload',
                'committedWorkload.user',
                'committedWorkload.contributedValue',
                'committedWorkload.contributedValue.expertiseScope',
                'committedWorkload.contributedValue.valueStream',
                'user',
            ],
        });
        return entities
            ? PlannedWorkloadMap.toDomainAll(entities)
            : new Array<PlannedWorkload>();
    }
    async update(plannedEntities: PlannedWorkloadEntity[]): Promise<void> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.upsert(
                PlannedWorkloadEntity,
                plannedEntities,
                {
                    conflictPaths: ['id'],
                },
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
