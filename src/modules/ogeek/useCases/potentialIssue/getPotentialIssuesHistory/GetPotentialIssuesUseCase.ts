import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { MomentService } from '../../../../../providers/moment.service';
import { SenteService } from '../../../../../shared/services/sente.service';
import { DataPotentialIssuesDto } from '../../../infra/dtos/getPotentialIssues/dataPotentialIssues.dto';
import { FromWeekToWeekWLInputDto } from '../../../infra/dtos/getPotentialIssues/getCommittedWorkloadByIssue.dto';
import { GetPotentialIssuesInputDto } from '../../../infra/dtos/getPotentialIssues/getPotentialIssuesInput.dto';
import { HistoryActualWorkloadDto } from '../../../infra/dtos/getPotentialIssues/historyActualWorkload.dto';
import { RawDataPotentialIssuesDto } from '../../../infra/dtos/getPotentialIssues/rawDataPotentialIssues.dto';
import { CommittedWorkloadMap } from '../../../mappers/committedWorkloadMap';
import { IssueMap } from '../../../mappers/issueMap';
import { PlannedWorkloadMap } from '../../../mappers/plannedWorkloadMap';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPotentialIssuesErrors } from './GetPotentialIssuesErrors';

type Response = Either<
    | AppError.UnexpectedError
    | GetPotentialIssuesErrors.GetPotentialIssuesFailed,
    Result<DataPotentialIssuesDto[]>
>;
interface ServerResponse {
    data: HistoryActualWorkloadDto[];
}
@Injectable()
export class GetPotentialIssuesUseCase
    implements IUseCase<GetPotentialIssuesInputDto, Promise<Response>>
{
    constructor(
        @Inject('IPlannedWorkloadRepo')
        public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('ICommittedWorkloadRepo')
        public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IContributedValueRepo')
        public readonly contributedValueloadRepo: IContributedValueRepo,
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo')
        public readonly issueRepo: IIssueRepo,
        public readonly senteService: SenteService,
    ) {}

    async execute(query: GetPotentialIssuesInputDto): Promise<Response> {
        const user = await this.userRepo.findById(query.userId);
        if (!user) {
            return left(
                new GetPotentialIssuesErrors.UserNotFound(),
            ) as Response;
        }

        const startDateOfWeek = MomentService.firstDateOfWeekByYear(
            query.startWeek,
            query.startYear,
        );
        const lastDateOfWeek = MomentService.lastDateOfWeekByYear(
            query.endWeek,
            query.endYear,
        );

        const userId = query.userId;
        try {
            const potentialIssuesList =
                await this.issueRepo.findHistoryByUserIdAndWeek(query);

            const committedWorkloadList =
                await this.committedWorkloadRepo.findAllByWeekAndYear({
                    userId,
                    startDateOfWeek,
                    lastDateOfWeek,
                } as FromWeekToWeekWLInputDto);

            const plannedWorkloadList =
                await this.plannedWorkloadRepo.findAllByWeekAndYear({
                    userId,
                    startDateOfWeek,
                    lastDateOfWeek,
                } as FromWeekToWeekWLInputDto);

            const committedWorkloadDtos = CommittedWorkloadMap.fromDomainAll(
                committedWorkloadList,
            );

            const plannedWorkloadDtos =
                PlannedWorkloadMap.fromDomainAll(plannedWorkloadList);
            const issueDtos = IssueMap.fromDomainAll(potentialIssuesList);

            let issueCount = 0;
            const rawDataDtos = new Array<RawDataPotentialIssuesDto>();
            issueDtos.forEach((issue) => {
                rawDataDtos.push({
                    dayOfWeek: issue.firstDateOfWeek,
                    issueStatus: issue.status,
                    note: issue.note,
                    committedWorkloads: [],
                    plannedWorkloads: [],
                    actualWorkloads: [],
                });
                issueCount++;
            });

            committedWorkloadDtos.forEach((committedWL) => {
                rawDataDtos.forEach((raw) => {
                    if (
                        raw.dayOfWeek <= committedWL.expiredDate &&
                        raw.dayOfWeek >= committedWL.startDate
                    ) {
                        raw.committedWorkloads.push({
                            ...committedWL,
                        });
                    }
                });
            });

            plannedWorkloadDtos.forEach((plannedWl) => {
                rawDataDtos.forEach((raw) => {
                    if (
                        moment(raw.dayOfWeek).year() ===
                            moment(plannedWl.startDate).year() &&
                        MomentService.convertDateToWeek(raw.dayOfWeek) ===
                            MomentService.convertDateToWeek(plannedWl.startDate)
                    ) {
                        raw.plannedWorkloads.push({
                            ...plannedWl,
                        });
                    }
                });
            });
            const request =
                await this.senteService.getActualWLforHistoryPotentialIssue<
                    HistoryActualWorkloadDto[]
                >(issueCount);

            const response = request?.data;
            if (!response) {
                return left(
                    new GetPotentialIssuesErrors.GetPotentialIssuesFailed(),
                );
            }

            const dataHistoryPotentialIssue =
                new Array<DataPotentialIssuesDto>();
            rawDataDtos.forEach((raw, index) => {
                const totalCommittedWLByWeek = raw.committedWorkloads.reduce(
                    (sum, current) => sum + current.committedWorkload,
                    0,
                );
                const totalPlannedWLByWeek = raw.plannedWorkloads.reduce(
                    (sum, current) => sum + current.plannedWorkload,
                    0,
                );

                dataHistoryPotentialIssue.push({
                    week: MomentService.convertDateToWeek(raw.dayOfWeek),
                    committedWorkload: totalCommittedWLByWeek,
                    plannedWorkload: totalPlannedWLByWeek,
                    actualWorkload: Number(response[index].actualWorkload),
                    issueStatus: raw.issueStatus,
                    note: raw.note,
                } as DataPotentialIssuesDto);
            });

            return right(Result.ok(dataHistoryPotentialIssue));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
