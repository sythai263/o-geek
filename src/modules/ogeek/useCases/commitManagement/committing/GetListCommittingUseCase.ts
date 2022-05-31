import { Inject, Injectable } from '@nestjs/common';

import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { CommittingWorkloadStatus } from '../../../../../common/constants/committingStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import {
    CommittingWorkload,
    DataListCommittingWorkload,
    FilterListCommittingWorkload,
} from '../../../infra/dtos/commitManagement/committing/committing.dto';
import { UserCompactDto } from '../../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { GetListCommittingErrors } from './GetListCommittingErrors';

type Response = Either<
    AppError.UnexpectedError | GetListCommittingErrors.ListCommittingNotFound,
    Result<DataListCommittingWorkload>
>;

@Injectable()
export class GetListCommittingUseCase
    implements IUseCase<FilterListCommittingWorkload, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    async execute(query: FilterListCommittingWorkload): Promise<Response> {
        try {
            const committing =
                await this.committedWorkloadRepo.findListCommittingWorkload(
                    query,
                );
            if (!committing) {
                return left(
                    new GetListCommittingErrors.ListCommittingNotFound(),
                );
            }

            const commits = new Array<CommittingWorkload>();
            for (const item of committing.data) {
                const user = new UserCompactDto(
                    item.userId,
                    item.alias,
                    item.name,
                    item.avatar,
                );
                const commit = new CommittingWorkload();
                commit.user = user;
                commit.daysUntilExpire = item.daysUntilExpire;
                commit.startDate = item.startDate;
                commit.totalCommit = item.totalCommit;
                commit.expiredDate = item.expiredDate;
                const index = commits.findIndex(
                    (element) => element.user.id === user.id,
                );
                if (index >= 0) {
                    if (item.status === CommittedWorkloadStatus.INCOMING) {
                        commits[index].status =
                            CommittingWorkloadStatus.WILL_CONTINUE;
                    }
                } else if (item.daysUntilExpire > 60) {
                    commit.status = CommittingWorkloadStatus.NORMAL;
                    commits.push(commit);
                } else if (item.status === CommittedWorkloadStatus.NOT_RENEW) {
                    commit.status = CommittingWorkloadStatus.WILL_NOT_CONTINUE;
                    commits.push(commit);
                } else {
                    commit.status = CommittingWorkloadStatus.UNHANDLED;
                    commits.push(commit);
                }
            }
            return right(Result.ok(new DataListCommittingWorkload(commits)));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
