import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SenteService } from '../../../../../shared/services/sente.service';
import { DetailCommittedWorkloadsByWeekDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkloadByWeek/DetailCommittedWorkloads.dto';
import { DetailCommittedWorkloadsByExpAndWeekDto } from '../../../infra/dtos/getDetailCommittedWorkloadByWeek/DetailCommttedWorkloadsByExp.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { GetDetailCommittedWorkloadByWeekErrors } from './GetDetailCommittedWorkloadByWeekErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetDetailCommittedWorkloadByWeekErrors.NotFoundCommittedWorkload
    | GetDetailCommittedWorkloadByWeekErrors.NotFoundActualWorklogs,
    Result<DetailCommittedWorkloadsByWeekDto>
>;

@Injectable()
export class GetDetailCommittedWorkloadByWeekUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,

        public readonly senteService: SenteService,
    ) {}
    async execute(week: number, member: number): Promise<Response> {
        try {
            const committedWorkloads =
                await this.committedWorkloadRepo.findInWeekAndByUserId(
                    member,
                    week,
                );
            if (!committedWorkloads || committedWorkloads.length === 0) {
                return left(
                    new GetDetailCommittedWorkloadByWeekErrors.NotFoundCommittedWorkload(),
                ) as Response;
            }
            const response = await this.senteService.getActualWorklogsByWeek<
                DetailCommittedWorkloadsByExpAndWeekDto[]
            >(committedWorkloads, week);
            const detialCommittedWorkloadsByExpAndWeekDto = response.data;
            if (
                !detialCommittedWorkloadsByExpAndWeekDto ||
                detialCommittedWorkloadsByExpAndWeekDto.length === 0
            ) {
                return left(
                    new GetDetailCommittedWorkloadByWeekErrors.NotFoundActualWorklogs(),
                ) as Response;
            }

            const detailCommittedWorkloadsByWeekDto = {
                data: detialCommittedWorkloadsByExpAndWeekDto,
            } as DetailCommittedWorkloadsByWeekDto;
            return right(Result.ok(detailCommittedWorkloadsByWeekDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
