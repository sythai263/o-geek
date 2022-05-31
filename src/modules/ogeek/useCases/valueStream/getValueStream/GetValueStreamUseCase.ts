import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { ActualPlanAndWorkLogDto } from '../../../infra/dtos/actualPlansAndWorkLogs.dto';
import { InputGetPlanWLDto } from '../../../infra/dtos/valueStreamsByWeek/inputGetPlanWL.dto';
import { StartAndEndDateOfWeekDto } from '../../../infra/dtos/valueStreamsByWeek/startAndEndDateOfWeek.dto';
import { ValueStreamsByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ValueStreamMap } from '../../../mappers/valueStreamMap';
import { ValueStreamsByWeekMap } from '../../../mappers/valueStreamsByWeekMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { GetValueStreamError } from './GetValueStreamErrors';

type Response = Either<
    AppError.UnexpectedError | GetValueStreamError.FailToGetValueStream,
    Result<ValueStreamsByWeekDto>
>;

interface ServerResponse {
    data: ActualPlanAndWorkLogDto[];
}
@Injectable()
export class GetValueStreamUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('IValueStreamRepo')
        public readonly valueStreamRepo: IValueStreamRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWLRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWLRepo: IPlannedWorkloadRepo,
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
        public readonly senteService: SenteService,
    ) {}

    getStartAndEndDateOfWeek(week: number): StartAndEndDateOfWeekDto {
        return {
            startDateOfWeek: MomentService.firstDateOfWeek(week),
            endDateOfWeek: MomentService.lastDateOfWeek(week),
        };
    }

    async execute(week: number, member: number): Promise<Response> {
        try {
            const startAndEndDateOfWeek = this.getStartAndEndDateOfWeek(week);
            const valueStreams = await this.valueStreamRepo.findAll();
            const committedWLs =
                await this.committedWLRepo.findByUserIdValueStream(
                    Number(member),
                    startAndEndDateOfWeek.startDateOfWeek,
                    startAndEndDateOfWeek.endDateOfWeek,
                );
            if (!committedWLs || committedWLs.length === 0) {
                return left(
                    new GetValueStreamError.NoCommittedWorkloadFound(),
                ) as Response;
            }
            const plannedWLs = await this.plannedWLRepo.findByUserId({
                startDateOfWeek: startAndEndDateOfWeek.startDateOfWeek,
                endDateOfWeek: startAndEndDateOfWeek.endDateOfWeek,
                userId: member,
            } as InputGetPlanWLDto);
            const committedWLDtos =
                CommittedWorkloadMap.fromDomainAll(committedWLs);
            const plannedWLDtos = PlannedWorkloadMap.fromDomainAll(plannedWLs);
            // get actual plans and worklogs
            const request =
                await this.senteService.getOverviewValueStreamCard<ServerResponse>(
                    MomentService.convertDateToWeek(
                        startAndEndDateOfWeek.startDateOfWeek,
                    ),
                    member,
                    committedWLDtos,
                    plannedWLDtos,
                );
            const actualPlanAndWorkLogDtos = request.data.data;
            const valueStreamDtos = ValueStreamMap.fromDomainAll(valueStreams);
            const valueStreamsByWeekDto = ValueStreamsByWeekMap.combineAllDto(
                committedWLDtos,
                plannedWLDtos,
                actualPlanAndWorkLogDtos,
                valueStreamDtos,
                week,
                startAndEndDateOfWeek.startDateOfWeek,
                startAndEndDateOfWeek.endDateOfWeek,
            );

            if (!valueStreamsByWeekDto) {
                return left(
                    new GetValueStreamError.FailToGetValueStream(),
                ) as Response;
            }
            return right(Result.ok(valueStreamsByWeekDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
