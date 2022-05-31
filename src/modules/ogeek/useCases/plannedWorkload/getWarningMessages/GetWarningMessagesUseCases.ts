/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal, Not } from 'typeorm';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { WarningMessagesDto } from '../../../infra/dtos/getWarningMessages/warningMessages.dto';
import { WeekDto } from '../../../infra/dtos/week.dto';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetWarningMessagesErrors } from './GetWarningMessagesErrors';

type Response = Either<
  AppError.UnexpectedError
  | GetWarningMessagesErrors.GetMessagesFailed
  | GetWarningMessagesErrors.LastWeekNotClosed
  | GetWarningMessagesErrors.UserNotFound,
  Result<WarningMessagesDto>
>;

@Injectable()
export class GetWarningMessagesUseCases
  implements IUseCase<WeekDto, Promise<Response>> {
  constructor(
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
    @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
  ) { }

  async execute(
    weekDto: WeekDto,
    userId: number,
  ): Promise<Response> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user) {
        return left(
          new GetWarningMessagesErrors.UserNotFound(),
        ) as Response;
      }

      const { week, year } = weekDto;
      const date = MomentService.firstDateOfWeekByYear(week, year);
      const startDateOfCurrentWeek = moment(date).startOf('week').toDate();

      const lastWeekPlannedWorkload = await this.plannedWorkloadRepo.findOne({
        user: { id: userId },
        status: Not(PlannedWorkloadStatus.ARCHIVE),
        startDate: Equal(moment(startDateOfCurrentWeek).subtract(7, 'days').toDate()),
      });
      if (lastWeekPlannedWorkload && !lastWeekPlannedWorkload.isClosed) {
        return left(
          new GetWarningMessagesErrors.LastWeekNotClosed(),
        ) as Response;
      }

      const currentWeekPlannedWorkloads = await this.plannedWorkloadRepo.find({
        user: { id: userId },
        startDate: Equal(startDateOfCurrentWeek),
      });

      // filter all EXECUTING and CLOSED
      const executingOrClosedPlannedWorkload = currentWeekPlannedWorkloads.find(plannedWL => plannedWL.isExecutingOrClosed);
      if (executingOrClosedPlannedWorkload) {
        return right(Result.ok(new WarningMessagesDto(
          executingOrClosedPlannedWorkload.status, true,
          !executingOrClosedPlannedWorkload.notReviewRetroAtTheEndOfTheWeek,
        )));
      }

      // remain only PLANNING => filter created by system
      const plannedWorkloadCreatedByUser = currentWeekPlannedWorkloads.find(plannedWL => plannedWL.isCreatedByUser);
      if (plannedWorkloadCreatedByUser) {
        return right(Result.ok(new WarningMessagesDto(PlannedWorkloadStatus.PLANNING, true, false)));
      }

      return right(Result.ok(new WarningMessagesDto(PlannedWorkloadStatus.PLANNING, false, false)));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
