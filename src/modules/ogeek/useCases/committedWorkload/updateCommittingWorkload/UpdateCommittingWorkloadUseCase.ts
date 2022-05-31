import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { DataCommittingWorkload } from '../../../infra/dtos/updateCommittingWorkload/updateCommittingWorkload.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { UpdateCommittingWorkloadErrors } from './UpdateCommittingWorkloadErrors';

type Response = Either<
    | AppError.UnexpectedError
    | UpdateCommittingWorkloadErrors.UserNotFound
    | UpdateCommittingWorkloadErrors.NotFound,
    Result<DataCommittingWorkload>
>;

@Injectable()
export class UpdateCommittingWorkloadUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IContributedValueRepo')
        public readonly contributedValueRepo: IContributedValueRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    ) {}
    async execute(userId: number, member: number): Promise<Response> {
        try {
            const user = await this.userRepo.findById(userId);
            const updatedBy = await this.userRepo.findById(member);
            if (!user) {
                return left(
                    new UpdateCommittingWorkloadErrors.UserNotFound(userId),
                ) as Response;
            }
            if (!updatedBy) {
                return left(
                    new UpdateCommittingWorkloadErrors.UserNotFound(member),
                ) as Response;
            }

            const committedWorkloads =
                await this.committedWorkloadRepo.findCommittingAndIncomingByUserId(
                    userId,
                );
            if (!committedWorkloads) {
                return left(new UpdateCommittingWorkloadErrors.NotFound());
            }
            const changedCommittingWorkload =
                CommittedWorkload.changeStatusActiveAndIncoming(
                    committedWorkloads,
                );

            const committedWorkloadEntities = CommittedWorkloadMap.toEntities(
                changedCommittingWorkload,
            );
            const updatedArray = await this.committedWorkloadRepo.updateMany(
                committedWorkloadEntities,
            );
            const committingWorkloadDto =
                CommittedWorkloadMap.fromDomainCommittingWorkloadArray(
                    updatedArray,
                );

            const dataCommittingWorkload = new DataCommittingWorkload(
                committingWorkloadDto,
            );

            return right(Result.ok(dataCommittingWorkload));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
