import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { User } from '../../../domain/user';
import { CreateCommittedWorkloadDto } from '../../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { WorkloadDto } from '../../../infra/dtos/workload.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { UserMap } from '../../../mappers/userMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreateCommittedWorkloadErrors } from '../createCommittedWorkload/CreateCommittedWorkloadErrors';
import { CommittedWorkloadCreatedEvent } from '../events/CommittedWorkloadEvent';
type Response = Either<
    | AppError.UnexpectedError
    | CreateCommittedWorkloadErrors.NotFound
    | CreateCommittedWorkloadErrors.ExistCommittedWorkloadInComing,
    Result<CommittedWorkloadShortDto[]>
>;

@Injectable()
export class UpdateCommittedWorkloadUseCase
    implements IUseCase<CreateCommittedWorkloadDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IContributedValueRepo')
        public readonly contributedValueRepo: IContributedValueRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,

        private _event: EventEmitter2,
    ) {}
    async execute(
        body: CreateCommittedWorkloadDto,
        member: number,
    ): Promise<Response> {
        try {
            const userId = body.userId;
            const user = await this.userRepo.findById(userId);
            const startDate = new Date(body.startDate);
            const expiredDate = new Date(body.expiredDate);
            const userCreated = await this.userRepo.findById(member);
            const createdBy = UserMap.toEntity(userCreated);
            if (!user) {
                return left(
                    new CreateCommittedWorkloadErrors.NotFound(
                        userId.toString(),
                    ),
                ) as Response;
            }
            if (startDate >= expiredDate) {
                return left(new CreateCommittedWorkloadErrors.DateError());
            }
            const committedWorkloads = await this.createCommittedWorkload(
                body.committedWorkloads,
                user,
                startDate,
                expiredDate,
                createdBy.id,
            );
            const committedWorkloadEntities =
                CommittedWorkloadMap.toEntities(committedWorkloads);

            const isIncoming = await this.checkCommittedInComing(userId);

            if (isIncoming) {
                const oldCommitted =
                    await this.getAndHandleOldCommittedWorkload(userId);

                const oldCommittedEntities =
                    CommittedWorkloadMap.toEntities(oldCommitted);

                const result =
                    await this.committedWorkloadRepo.addCommittedWorkload(
                        committedWorkloadEntities,
                        oldCommittedEntities,
                    );
                if (result.length < 0) {
                    return left(
                        new AppError.UnexpectedError(
                            'Internal Server Error Exception',
                        ),
                    );
                }
                const dataEvent = new CommittedWorkloadCreatedEvent(
                    result,
                    oldCommitted,
                    startDate,
                );
                this._event.emit('committed-workload.updated', dataEvent);
                const committedWorkloadsDto =
                    CommittedWorkloadMap.fromCommittedWorkloadShortArray(
                        result,
                    );

                return right(Result.ok(committedWorkloadsDto));
            }
            const oldCommittedActive =
                await this.getAndHandleOldCommittedWorkloadActive(
                    userId,
                    startDate,
                );
            if (!oldCommittedActive) {
                return left(new CreateCommittedWorkloadErrors.DateError());
            }

            const oldCommittedActiveEntities =
                CommittedWorkloadMap.toEntities(oldCommittedActive);

            const resultActive =
                await this.committedWorkloadRepo.addCommittedWorkload(
                    committedWorkloadEntities,
                    oldCommittedActiveEntities,
                );

            if (resultActive.length < 0) {
                return left(
                    new AppError.UnexpectedError(
                        'Internal Server Error Exception',
                    ),
                );
            }
            const dataActiveEvent = new CommittedWorkloadCreatedEvent(
                resultActive,
                oldCommittedActive,
                startDate,
            );
            this._event.emit('committed-workload.updated', dataActiveEvent);
            const committedWorkloadsActiveDto =
                CommittedWorkloadMap.fromCommittedWorkloadShortArray(
                    resultActive,
                );

            return right(Result.ok(committedWorkloadsActiveDto));
        } catch (err) {
            return left(err);
        }
    }
    async createCommittedWorkload(
        committedWorkload: WorkloadDto[],
        user: User,
        startDate: Date,
        expiredDate: Date,
        createdBy?: number,
    ): Promise<CommittedWorkload[]> {
        const commitArray = new Array<CommittedWorkload>();
        for await (const workload of committedWorkload) {
            const contribute = await this.contributedValueRepo.findOne(
                workload.valueStreamId,
                workload.expertiseScopeId,
            );
            if (!contribute) {
                return null;
            }
            const commit = CommittedWorkload.create(
                {
                    createdBy,
                    expiredDate,
                    startDate,
                    user,
                    updatedBy: createdBy,
                    committedWorkload: workload.workload,
                    contributedValue: contribute,
                },
                new UniqueEntityID(),
            ).getValue();
            commitArray.push(commit);
        }
        return commitArray;
    }
    async getAndHandleOldCommittedWorkloadActive(
        userId: number,
        startDate: Date,
    ): Promise<CommittedWorkload[]> {
        const oldCommits = await this.committedWorkloadRepo.findByUserId(
            userId,
            CommittedWorkloadStatus.ACTIVE,
        );
        for await (const oldCommit of oldCommits) {
            if (oldCommit.checkExpiredDateWhenUpdate(startDate)) {
                return null;
            }
            oldCommit.handleExpiredDateOldCommittedWorkload(startDate);
        }
        return oldCommits;
    }

    async getAndHandleOldCommittedWorkload(
        userId: number,
    ): Promise<CommittedWorkload[]> {
        const oldCommits = await this.committedWorkloadRepo.findByUserId(
            userId,
            CommittedWorkloadStatus.INCOMING,
        );
        for await (const oldCommit of oldCommits) {
            oldCommit.changeStatus(CommittedWorkloadStatus.INACTIVE);
        }
        return oldCommits;
    }
    async checkCommittedInComing(userId: number): Promise<boolean> {
        const committed =
            await this.committedWorkloadRepo.findCommittedInComing(userId);
        return committed ? committed.isComing() : false;
    }
}
