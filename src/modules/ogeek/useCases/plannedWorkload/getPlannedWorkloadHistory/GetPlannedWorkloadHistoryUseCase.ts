/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Equal, MoreThan } from 'typeorm';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { PlannedWorkloadHistoryDto } from '../../../infra/dtos/getPlanHistory/plannedWorkloadHistory.dto';
import { ValueStreamShortDto } from '../../../infra/dtos/getPlanHistory/valueStreamShort.dto';
import { WeekDto } from '../../../infra/dtos/week.dto';
import { ExpertiseScopeMap } from '../../../mappers/expertiseScopeMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPlannedWorkloadHistoryErrors } from './GetPlannedWorkloadHistoryErrors';

type Response = Either<
  AppError.UnexpectedError
  | GetPlannedWorkloadHistoryErrors.GetPlannedWorkloadHistoryFailed
  | GetPlannedWorkloadHistoryErrors.UserNotFound,
  Result<PlannedWorkloadHistoryDto>
>;

@Injectable()
export class GetPlannedWorkloadHistoryUseCase
  implements IUseCase<WeekDto, Promise<Response>>
{
  constructor(
    @Inject('IPlannedWorkloadRepo')
    public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
    @Inject('ICommittedWorkloadRepo')
    public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
    @Inject('IContributedValueRepo')
    public readonly contributedValueloadRepo: IContributedValueRepo,
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
  ) { }

  async execute(
    weekDto: WeekDto,
    userId: number,
  ): Promise<Response> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user) {
        return left(
          new GetPlannedWorkloadHistoryErrors.UserNotFound(),
        ) as Response;
      }

      const notes = [] as string[];
      const committedWorkloads = await this.committedWorkloadRepo.findByWeek(userId, weekDto);
      const plannedWorkloads = await this.plannedWorkloadRepo.find(
        {
          user: { id: userId },
          startDate: Equal(MomentService.firstDateOfWeekByYear(weekDto.week, weekDto.year)),
          createdBy: MoreThan(0),
        },
      );

      const sortedPlannedWorkloadsByCreatedAt = plannedWorkloads
        .sort((a: PlannedWorkload, b: PlannedWorkload) => a.createdAt > b.createdAt ? 1 : -1);

      const valueStreamsHashedMap = new Map<number, ValueStreamShortDto>();
      for (const committedWorkload of committedWorkloads) {
        const valueStreamId = committedWorkload.getValueStreamId();

        if (!valueStreamsHashedMap.get(valueStreamId)) {

          const valueStreamDto = new ValueStreamShortDto();
          const valueStreamDtoId = committedWorkload.valueStream.id.toString();
          valueStreamDto.id = Number(valueStreamDtoId);
          valueStreamDto.name = committedWorkload.valueStream.name;

          const expertiseScopeDto = ExpertiseScopeMap.fromCommittedWLAndPlannedWLsByWeek(
            committedWorkload, sortedPlannedWorkloadsByCreatedAt, weekDto,
            function(plannedWL) {
              notes.push(plannedWL.reason);
            },
          );
          valueStreamDto.expertiseScopes = [expertiseScopeDto];
          valueStreamsHashedMap.set(valueStreamId, valueStreamDto);
        } else {
          const expertiseScopeDto = ExpertiseScopeMap.fromCommittedWLAndPlannedWLsByWeek(
            committedWorkload, sortedPlannedWorkloadsByCreatedAt, weekDto,
          );
          const valueStreamHashedMap = valueStreamsHashedMap.get(valueStreamId);
          valueStreamHashedMap.expertiseScopes.push(expertiseScopeDto);
        }
      }
      const valueStreams = Array.from(valueStreamsHashedMap.values());
      const plannedWorkloadHistoryDto = new PlannedWorkloadHistoryDto(notes, valueStreams);

      return right(Result.ok(plannedWorkloadHistoryDto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
