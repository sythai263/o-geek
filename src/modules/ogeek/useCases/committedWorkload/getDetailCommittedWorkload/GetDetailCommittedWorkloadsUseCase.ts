import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { DetailCommittedWorkloadsDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkload/DetailCommittedWorkloads.dto';
import { DetailCommittedWorkloadsByExpDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkload/DetailCommttedWorkloadsByExp.dto';
import { ICommittedWorkloadRepo } from '../../../../ogeek/repos/committedWorkloadRepo';
import { GetDetailCommittedWorkloadErrors } from './GetDetailCommittedWorkloadErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetDetailCommittedWorkloadErrors.NotFoundCommittedWorkload
    | GetDetailCommittedWorkloadErrors.NotFoundActualWorklogs,
    Result<DetailCommittedWorkloadsDto>
>;

@Injectable()
export class GetDetailCommittedWorkloadUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,

        public readonly senteService: SenteService,
    ) {}
    async execute(member: number): Promise<Response> {
        try {
            const currentWeek = MomentService.getCurrentWeek();
            const committedWorkloads =
                await this.committedWorkloadRepo.findInWeekAndByUserId(
                    member,
                    currentWeek,
                );
            if (!committedWorkloads || committedWorkloads.length === 0) {
                return left(
                    new GetDetailCommittedWorkloadErrors.NotFoundCommittedWorkload(),
                ) as Response;
            }
            const response = await this.senteService.getActualWorklogsRecent<
                DetailCommittedWorkloadsByExpDto[]
            >(committedWorkloads, currentWeek);
            const detialCommittedWorkloadsByExpDto = response.data;
            if (
                !detialCommittedWorkloadsByExpDto ||
                detialCommittedWorkloadsByExpDto.length === 0
            ) {
                return left(
                    new GetDetailCommittedWorkloadErrors.NotFoundActualWorklogs(),
                ) as Response;
            }

            const detailCommittedWorkloadsDto = {
                data: detialCommittedWorkloadsByExpDto,
            } as DetailCommittedWorkloadsDto;
            return right(Result.ok(detailCommittedWorkloadsDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
