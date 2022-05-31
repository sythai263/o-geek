/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Equal } from 'typeorm';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPlannedWorkloadHistoryErrors } from '../getPlannedWorkloadHistory/GetPlannedWorkloadHistoryErrors';
import { ReviewRetroErrors } from './ReviewRetroErrors';

type Response = Either<
  AppError.UnexpectedError
  | GetPlannedWorkloadHistoryErrors.GetPlannedWorkloadHistoryFailed
  | GetPlannedWorkloadHistoryErrors.UserNotFound,
  Result<void>
>;

@Injectable()
export class ReviewRetroUseCase
  implements IUseCase<Date, Promise<Response>> {
  constructor(
    @Inject('IUserRepo') public readonly userRepo: IUserRepo,
    @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
  ) { }

  async execute(
    startDate: Date,
    userId: number,
  ): Promise<Response> {
    try {
      const startDateOfCurrentWeek = moment(startDate).startOf('week').toDate();
      const reviewRetroPlannedWorkloads = await this.plannedWorkloadRepo.find(
        {
          user: { id: userId },
          status: PlannedWorkloadStatus.EXECUTING,
          startDate: Equal(startDateOfCurrentWeek),
        },
      );

      if (!reviewRetroPlannedWorkloads || reviewRetroPlannedWorkloads.length === 0) {
        return left(
          new ReviewRetroErrors.NotStartWeek(),
        ) as Response;
      }

      const reviewRetroPlannedWorkloadEntities = reviewRetroPlannedWorkloads.map(plannedWL => {
        plannedWL.closeWeek(userId);
        return PlannedWorkloadMap.toEntity(plannedWL);
      });

      await this.plannedWorkloadRepo.updateMany(reviewRetroPlannedWorkloadEntities);
      return right(Result.ok());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
