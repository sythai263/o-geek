import { Inject, Injectable, Response } from '@nestjs/common';
import * as _ from 'lodash';

import {
    MAX_VIEWCHART_LENGTH,
    MAX_WORKLOG_LENGTH,
    NEAR_MAX_WORKLOG_LENGTH,
} from '../../../../../common/constants/chart';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { CommittedWorkload } from '../../../../ogeek/domain/committedWorkload';
import { PlannedWorkload } from '../../../../ogeek/domain/plannedWorkload';
import { OverViewChartMap } from '../../../../ogeek/mappers/overViewChartMap';
import { OverviewChartDataDto } from '../../../infra/dtos/overviewChart/overviewChartData.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IExpertiseScopeRepo } from '../../../repos/expertiseScopeRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetOverviewChartDataErrors } from './GetOverviewChartDataErrors';
type Response = Either<
    | AppError.UnexpectedError
    | GetOverviewChartDataErrors.GetOverviewChartDataFailed,
    Result<OverviewChartDataDto[]>
>;

interface ServerResponse {
    data: OverviewChartDataDto[];
}

@Injectable()
export class GetOverviewChartDataUseCase
    implements IUseCase<number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,

        @Inject('IExpertiseScopeRepo')
        public readonly expertiseScopeRepo: IExpertiseScopeRepo,

        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,

        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,

        public readonly senteService: SenteService,
    ) {}
    getWorklogLength(
        createdAt: Date,
        startWeekChart: number,
        totalPlannedWorkloadsByExpArray: PlannedWorkload[],
    ): number {
        const currentDate = new Date();
        const currentPlanWeekly = totalPlannedWorkloadsByExpArray.find(
            (plannedWorkload) => plannedWorkload.isClosedInCurrentWeek(),
        );
        if (currentPlanWeekly) {
            return MAX_WORKLOG_LENGTH;
        }
        if (createdAt.getFullYear() < currentDate.getFullYear()) {
            return NEAR_MAX_WORKLOG_LENGTH;
        }

        const createdWeek = MomentService.convertDateToWeek(createdAt);
        return startWeekChart >= createdWeek
            ? NEAR_MAX_WORKLOG_LENGTH
            : createdWeek - startWeekChart;
    }
    getArrayWeekChart(startWeekChart: number): number[] {
        return [...Array(MAX_VIEWCHART_LENGTH).keys()].map(
            (item) => item + startWeekChart,
        );
    }
    getTotalCommittedWorkloadByExp(
        committedWorkloads: CommittedWorkload[],
    ): CommittedWorkload[] {
        const totalCommittedWorkloadsByExpArray =
            new Array<CommittedWorkload>();
        const totalCommittedWorkloadsByExpObj = _.groupBy(
            committedWorkloads,
            (committedWorkload) => [
                committedWorkload.contributedValue.expertiseScope.id.toValue(),
                committedWorkload.startDate,
            ],
        );
        _.forOwn(
            totalCommittedWorkloadsByExpObj,
            (totalCommittedWorkloadByExpObj) => {
                const firstElementTotalCommittedWorkload = _.head(
                    totalCommittedWorkloadByExpObj,
                );
                const totalPlannedWl = _.reduce(
                    totalCommittedWorkloadByExpObj,
                    (sum, current) => sum + current.props.committedWorkload,
                    0,
                );
                if (firstElementTotalCommittedWorkload) {
                    firstElementTotalCommittedWorkload.committedWorkload =
                        totalPlannedWl;
                    totalCommittedWorkloadsByExpArray.push(
                        firstElementTotalCommittedWorkload,
                    );
                }
            },
        );
        return totalCommittedWorkloadsByExpArray;
    }

    getTotalPlannedWorkloadByExp(
        plannedWorkloads: PlannedWorkload[],
    ): PlannedWorkload[] {
        const totalPlannedWorkloadsByExpArray = new Array<PlannedWorkload>();
        const totalPlannedWorkloadsByExpObj = _.groupBy(
            plannedWorkloads,
            (plannedWorkload) => [
                plannedWorkload.contributedValue.expertiseScope.id.toValue(),
                plannedWorkload.startDate,
            ],
        );
        _.forOwn(
            totalPlannedWorkloadsByExpObj,
            (totalPlannedWorkloadByExpObj) => {
                const firstElementTotalPlannedWorkload = _.head(
                    totalPlannedWorkloadByExpObj,
                );
                const totalPlannedWl = _.reduce(
                    totalPlannedWorkloadByExpObj,
                    (sum, current) => sum + current.props.plannedWorkload,
                    0,
                );
                if (firstElementTotalPlannedWorkload) {
                    firstElementTotalPlannedWorkload.plannedWorkload =
                        totalPlannedWl;
                    totalPlannedWorkloadsByExpArray.push(
                        firstElementTotalPlannedWorkload,
                    );
                }
            },
        );
        return totalPlannedWorkloadsByExpArray;
    }
    async execute(week: number, member: number): Promise<Response> {
        try {
            // get date week
            const user = await this.userRepo.findById(member);

            const startWeekChart = MomentService.shiftFirstWeekChart(
                user.createdAt,
            );
            const endWeekChart =
                MomentService.shiftLastWeekChart(startWeekChart);
            const startDate = new Date(
                MomentService.firstDateOfWeek(startWeekChart),
            );
            const endDate = new Date(
                MomentService.lastDateOfWeek(endWeekChart),
            );
            const weekChartArray = this.getArrayWeekChart(startWeekChart);
            // get data from database
            const expertiseScopes = await this.expertiseScopeRepo.findAll();

            const plannedWorkloads =
                await this.plannedWorkloadRepo.findByIdWithTimeRange(
                    member,
                    startDate,
                    endDate,
                );

            const totalPlannedWorkloadsByExpArray =
                this.getTotalPlannedWorkloadByExp(plannedWorkloads);
            const committedWorkloads =
                await this.committedWorkloadRepo.findByUserIdInTimeRange(
                    member,
                    MomentService.firstDateOfWeek(startWeekChart),
                    MomentService.lastDateOfWeek(endWeekChart),
                );
            const totalCommittedWorkloadsByExpArray =
                this.getTotalCommittedWorkloadByExp(committedWorkloads);
            const worklogLength = this.getWorklogLength(
                user.createdAt,
                startWeekChart,
                totalPlannedWorkloadsByExpArray,
            );
            const overviewChartDataDtos = OverViewChartMap.combineAllToDto(
                expertiseScopes,
                totalCommittedWorkloadsByExpArray,
                totalPlannedWorkloadsByExpArray,
                weekChartArray,
                worklogLength,
            );

            const request =
                await this.senteService.getActualWorkload<ServerResponse>(
                    overviewChartDataDtos,
                    member,
                );
            const worklogs = request.data.data;
            if (overviewChartDataDtos) {
                return right(Result.ok(worklogs));
            }
            return left(
                new GetOverviewChartDataErrors.GetOverviewChartDataFailed(
                    member,
                ),
            ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
