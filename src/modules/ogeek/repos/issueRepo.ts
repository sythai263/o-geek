import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, getConnection, Repository } from 'typeorm';

import { IssueStatus } from '../../../common/constants/issueStatus';
import { MomentService } from '../../../providers/moment.service';
import { DomainId } from '../domain/domainId';
import { Issue } from '../domain/issue';
import { UserEntity } from '../infra/database/entities';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { InputPotentialIssueDto } from '../infra/dtos/getPotentialIssue/inputPotentialIssue.dto';
import { GetPotentialIssuesInputDto } from '../infra/dtos/getPotentialIssues/getPotentialIssuesInput.dto';
import { StartEndDateOfWeekWLInputDto } from '../infra/dtos/workloadListByWeek/startEndDateOfWeekInput.dto';
import { IssueMap } from '../mappers/issueMap';

export interface IIssueRepo {
    findById(issueId: DomainId | number): Promise<Issue>;
    findAll(): Promise<Issue[]>;
    findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<Issue[]>;
    save(
        userId: number,
        status: IssueStatus,
        note: string,
        firstDateOfWeek: Date,
        picId: number,
    ): Promise<Issue>;
    findByUserId(
        startDateOfWeek: string,
        endDateOfWeek: string,
        userId: number,
    ): Promise<Issue>;
    findByUserIdAndWeek({
        userId,
        firstDateOfWeek,
    }: InputPotentialIssueDto): Promise<Issue>;
    update(potentialIssueEntity: IssueEntity): Promise<Issue>;
    createMany(entities: IssueEntity[]): Promise<Issue[]>;
    findHistoryByUserIdAndWeek({
        userId,
        startWeek,
        startYear,
        endWeek,
        endYear,
    }: GetPotentialIssuesInputDto): Promise<Issue[]>;
}

@Injectable()
export class IssueRepository implements IIssueRepo {
    constructor(
        @InjectRepository(IssueEntity)
        protected repo: Repository<IssueEntity>,
    ) {}

    async findById(issueId: DomainId | number): Promise<Issue> {
        issueId =
            issueId instanceof DomainId
                ? Number(issueId.id.toValue())
                : issueId;
        const entity = await this.repo.findOne({
            where: {
                id: issueId,
            },
            relations: ['user'],
        });
        return entity ? IssueMap.toDomain(entity) : null;
    }

    async findAll(): Promise<Issue[]> {
        const entities = await this.repo.find({
            relations: ['user'],
        });
        return entities ? IssueMap.toDomainAll(entities) : null;
    }

    async findAllByWeek({
        startDateOfWeek,
        endDateOfWeek,
    }: StartEndDateOfWeekWLInputDto): Promise<Issue[]> {
        const entities = await this.repo.find({
            where: {
                createdAt: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: ['user'],
        });

        return entities ? IssueMap.toDomainAll(entities) : new Array<Issue>();
    }

    async findByUserId(
        startDateOfWeek: string,
        endDateOfWeek: string,
        userId: number,
    ): Promise<Issue> {
        const entity = await this.repo.findOne({
            where: {
                user: { id: userId },
                createdAt: Between(startDateOfWeek, endDateOfWeek),
            },
            relations: ['user'],
        });

        return entity ? IssueMap.toDomain(entity) : null;
    }

    async findByUserIdAndWeek({
        userId,
        firstDateOfWeek,
    }: InputPotentialIssueDto): Promise<Issue> {
        const entity = await this.repo.findOne({
            where: {
                user: { id: userId },
                firstDateOfWeek: Equal(firstDateOfWeek),
            },
            relations: ['user'],
        });
        return entity ? IssueMap.toDomain(entity) : null;
    }

    async findHistoryByUserIdAndWeek({
        userId,
        startWeek,
        startYear,
        endWeek,
        endYear,
    }: GetPotentialIssuesInputDto): Promise<Issue[]> {
        const entities = await this.repo.find({
            where: {
                user: userId,
                firstDateOfWeek: Between(
                    MomentService.firstDateOfWeekByYear(startWeek, startYear),
                    MomentService.lastDateOfWeekByYear(endWeek, endYear),
                ),
            },
            relations: ['user'],
        });
        return entities ? IssueMap.toDomainAll(entities) : new Array<Issue>();
    }
    async save(
        userId: number,
        status: IssueStatus,
        note: string,
        firstDateOfWeek: Date,
        picId: number,
    ): Promise<Issue> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            const user = new UserEntity(userId);

            await queryRunner.startTransaction();
            const potentialIssue = new IssueEntity();
            potentialIssue.user = user;
            potentialIssue.status = status;
            potentialIssue.note = note;
            potentialIssue.firstDateOfWeek = firstDateOfWeek;
            potentialIssue.createdAt = new Date();
            potentialIssue.createdBy = picId;

            await queryRunner.manager.save(potentialIssue);
            await queryRunner.commitTransaction();
            return potentialIssue ? IssueMap.toDomain(potentialIssue) : null;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async update(potentialIssueEntity: IssueEntity): Promise<Issue> {
        const entity = await this.repo.save(potentialIssueEntity);

        return entity ? IssueMap.toDomain(entity) : null;
    }

    async createMany(entities: IssueEntity[]): Promise<Issue[]> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const issue = await queryRunner.manager.save(IssueEntity, entities);
            await queryRunner.commitTransaction();
            return issue || issue.length === 0
                ? IssueMap.toDomainAll(issue)
                : null;
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
