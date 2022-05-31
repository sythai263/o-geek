import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { DataCommittedWorkload } from '../CommittedWorkloadController';
import { FilterCommittedWorkload } from '../FilterCommittedWorkload';
import { GetCommittedWorkloadErrors } from './GetCommittedWorkloadErrors';
type Response = Either<
    AppError.UnexpectedError | GetCommittedWorkloadErrors.NotFound,
    Result<DataCommittedWorkload>
>;

@Injectable()
export class GetCommittedWorkloadUseCase
    implements IUseCase<FilterCommittedWorkload | number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    ) {}
    async execute(query: FilterCommittedWorkload): Promise<Response> {
        try {
            const committedWorkloadsDomain =
                await this.committedWorkloadRepo.findAllCommittedWorkload(
                    query,
                );
            const committedWorkloadsDto =
                CommittedWorkloadMap.fromCommittedWorkloadShortArray(
                    committedWorkloadsDomain.data,
                );
            const data = new DataCommittedWorkload(
                committedWorkloadsDto,
                committedWorkloadsDomain.meta,
            );
            return right(Result.ok(data));
        } catch (err) {
            return left(err);
        }
    }
}
