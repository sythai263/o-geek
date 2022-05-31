import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { historyWorkloads as historyWorkloadsConst } from '../../../common/constants/history';
import { DomainId } from '../domain/domainId';
import { User } from '../domain/user';
import { IssueEntity } from '../infra/database/entities';
import { UserEntity } from '../infra/database/entities/user.entity';
import { PaginationRepoDto } from '../infra/dtos/pagination.dto';
import { HistoryWorkloadDto } from '../infra/dtos/workloadListUsers/historyWorkload.dto';
import { HistoryWorkloadDataDto } from '../infra/dtos/workloadListUsers/historyWorkloadData.dto';
import { UserMap } from '../mappers/userMap';

export interface IUserRepo {
    findById(userId: DomainId | number): Promise<User>;
    findByAlias(alias: string): Promise<User>;
    findAllUser(): Promise<User[]>;
    update(condition: any, update: any): Promise<void>;
    findPotentialIssuesHistoryInTimeRange(
        userId: number,
        startDateOfStartWeek: Date,
        startDateOfEndWeek: Date,
    ): Promise<any[]>;
    findListUserWorkload(
        pagination: PaginationRepoDto,
        firstDateOfWeek: Date,
        endDateOfCurrentWeek: Date,
        search?: string,
    ): Promise<HistoryWorkloadDataDto>;
}

@Injectable()
export class UserRepository implements IUserRepo {
    constructor(
        @InjectRepository(UserEntity)
        protected repo: Repository<UserEntity>,
        @InjectRepository(IssueEntity)
        protected issueRepo: Repository<IssueEntity>,
    ) {}
    async findAllUser(): Promise<User[]> {
        const users = await this.repo.find();
        return users ? UserMap.toArrayDomain(users) : null;
    }
    async findByAlias(alias: string): Promise<User> {
        const entity = await this.repo.findOne({ where: { alias } });
        return entity ? UserMap.toDomain(entity) : null;
    }

    async findById(userId: DomainId | number): Promise<User> {
        const id =
            userId instanceof DomainId ? Number(userId.id.toValue()) : userId;
        const entity = await this.repo.findOne(id);
        return entity ? UserMap.toDomain(entity) : null;
    }

    async createUser(user: User): Promise<User> {
        try {
            const entity = this.repo.create({
                alias: user.alias,
                name: user.name,
                phone: user.phone,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            });
            const createdUser = await this.repo.save(entity);
            return createdUser ? UserMap.toDomain(entity) : null;
        } catch (err) {
            return null;
        }
    }

    async update(condition: any, update: any): Promise<void> {
        await this.repo.update(condition, update);
    }

    async findPotentialIssuesHistoryInTimeRange(
        userId: number,
        startDateOfStartWeek: Date,
        startDateOfEndWeek: Date,
    ): Promise<any[]> {
        return this.repo
            .createQueryBuilder('user')
            .select('user.id', 'userId')
            .addSelect('user.alias', 'alias')
            .where('user.id = :userId', { userId })
            .innerJoinAndSelect('user.issue', 'issue')
            .addSelect('issue.created_at', 'created_at')
            .addSelect('issue.updated_at', 'updated_at')
            .addSelect('issue.first_date_of_week', 'first_date_of_week')
            .addSelect('issue.status', 'status')
            .addSelect('issue.note', 'note')
            .andWhere(
                'issue.first_date_of_week >= :startDateOfStartWeek AND issue.first_date_of_week <= :startDateOfEndWeek',
                {
                    startDateOfStartWeek,
                    startDateOfEndWeek,
                },
            )
            .getRawMany();
    }

    async findListUserWorkload(
        pagination: PaginationRepoDto,
        firstDateOfWeek: Date,
        endDateOfCurrentWeek: Date,
        search?: string,
    ): Promise<HistoryWorkloadDataDto> {
        const subQuery = this.issueRepo
            .createQueryBuilder('issue')
            .select('issue.note', 'note')
            .addSelect('issue.status', 'status')
            .addSelect('issue.user_id', 'userId')
            .addSelect('issue.id', 'id')
            .addSelect('issue.first_date_of_week', 'mark')
            .where(
                `issue.first_date_of_week >= '${firstDateOfWeek.toISOString()}'`,
            )
            .andWhere(
                `issue.first_date_of_week <= '${endDateOfCurrentWeek.toISOString()}'`,
            );

        const historyWorkloads = this.repo
            .createQueryBuilder('user')
            .select('user.id', 'userId')
            .addSelect('user.alias', 'alias')
            .addSelect('user.avatar', 'avatar')
            .leftJoin('user.committedWorkloads', 'committed_workload')
            .leftJoin(
                '(' + subQuery.getQuery() + ')',
                'issue',
                '"user"."id" = "issue"."userId"',
            )
            .addSelect(
                'SUM("committed_workload"."committed_workload")',
                'committed',
            );

        if (search) {
            historyWorkloads.where(`alias ILIKE '%${search}%'`);
        }

        historyWorkloads
            .addSelect(['issue.note', 'issue.status', 'issue.mark'])
            .groupBy('user.id')
            .addGroupBy('user.alias')
            .addGroupBy('user.avatar')
            .addGroupBy('issue.status')
            .addGroupBy('issue.note')
            .addGroupBy('mark')
            .addGroupBy('committed_workload.status')
            .having('committed_workload.status = :name', {
                name: CommittedWorkloadStatus.ACTIVE,
            })
            .orHaving('committed_workload.status = :name2', {
                name2: CommittedWorkloadStatus.NOT_RENEW,
            });

        const historyWorkloadsQuery = await historyWorkloads
            .orderBy(pagination.order)
            .offset(pagination.page * pagination.limit)
            .limit(
                pagination.limit * historyWorkloadsConst.WORKLOAD_IN_THREE_WEEK,
            )
            .getRawMany();

        const userItem = await this.repo
            .createQueryBuilder('user')
            .innerJoin('user.committedWorkloads', 'committedWorkload')
            .where('committedWorkload.status = :status1', {
                status1: CommittedWorkloadStatus.ACTIVE,
            })
            .orWhere('committedWorkload.status = :status2', {
                status2: CommittedWorkloadStatus.NOT_RENEW,
            })
            .getMany();

        return {
            itemCount: userItem.length,
            data: historyWorkloadsQuery as HistoryWorkloadDto[],
        } as HistoryWorkloadDataDto;
    }
}
