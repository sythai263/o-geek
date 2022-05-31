/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import * as moment from 'moment';

import { dateRange } from '../../../../../common/constants/dateRange';
import { DefaultValue } from '../../../../../common/constants/defaultValue';
import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SenteService } from '../../../../../shared/services/sente.service';
import { CommittedWorkload } from '../../../domain/committedWorkload';
import { DomainId } from '../../../domain/domainId';
import { PlannedWorkload } from '../../../domain/plannedWorkload';
import { DataResponseDto } from '../../../infra/dtos/overviewSummaryYear/dataResponse.dto';
import { ExpertiseScopeDto } from '../../../infra/dtos/overviewSummaryYear/expertiseScope.dto';
import { ValueStreamsDto } from '../../../infra/dtos/overviewSummaryYear/valueStreams.dto';
import { ICommittedWorkloadRepo } from '../../../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../../../repos/contributedValueRepo';
import { IPlannedWorkloadRepo } from '../../../repos/plannedWorkloadRepo';
import { IValueStreamRepo } from '../../../repos/valueStreamRepo';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';

type Response = Either<
    AppError.UnexpectedError | GetOverviewSummaryYearErrors.FailToGetOverviewSummaryYear,
    Result<DataResponseDto>
>;

@Injectable()
export class GetOverviewSummaryYearUseCase
    implements IUseCase<DomainId | number, Promise<Response>> {
    constructor(
        @Inject('ICommittedWorkloadRepo') public readonly committedWorkloadRepo: ICommittedWorkloadRepo,
        @Inject('IPlannedWorkloadRepo') public readonly plannedWorkloadRepo: IPlannedWorkloadRepo,
        @Inject('IContributedValueRepo') public readonly contributedValueRepo: IContributedValueRepo,
        @Inject('IValueStreamRepo') public readonly valueStreamRepo: IValueStreamRepo,
        public readonly senteService: SenteService,
    ) { }

    async execute(userId: DomainId | number): Promise<Response> {
        try {
            const startDateYear = moment().startOf('year').format('YYYY-MM-DD');
            const startDateOfYear = moment(startDateYear, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');

            const endDateOfYear = moment(startDateOfYear, 'YYYY-MM-DD').add(dateRange.DAY_OF_YEAR, 'days').format('YYYY-MM-DD');

            const committedWorkloads = await this.committedWorkloadRepo.findByUserIdOverview(userId);
            const plannedWorkloads = await this.plannedWorkloadRepo.findByUserIdOverview(userId, startDateOfYear, endDateOfYear);
            const contributedValues = await this.contributedValueRepo.findAll();

            committedWorkloads.map((committedWorkloadItem) => {
                committedWorkloadItem.calculate(startDateOfYear, endDateOfYear);
                committedWorkloadItem.sumPlannedWorkload = PlannedWorkload.calculate(plannedWorkloads, committedWorkloadItem);
            });

            const filteredContributedValues =
            contributedValues.map((contributedValueItem) => {
                const committedWLs = _.filter(committedWorkloads, { contributedValue: { id: contributedValueItem.id } });
                const totalCommittedWL = committedWLs.reduce((committedWorkload, committedWorkloadArray) =>
                committedWorkload + committedWorkloadArray.sumCommittedWorkload, 0);
                const totalPlannedWL = committedWLs.reduce((committedWorkload, committedWorkloadArray) =>
                committedWorkload + committedWorkloadArray.sumPlannedWorkload, 0);

                const committedWorkloadDomain = CommittedWorkload.create(
                    {
                        committedWorkload: totalCommittedWL,
                        contributedValue: contributedValueItem,
                    },
                    new UniqueEntityID(contributedValueItem.id.toString()),
                );
                return PlannedWorkload.create(
                    {
                        committedWorkload: committedWorkloadDomain.getValue(),
                        plannedWorkload: totalPlannedWL,
                        contributedValue: contributedValueItem,
                    },
                    new UniqueEntityID(contributedValueItem.id.toString()),
                );
            });

            const filteredPlannedWorkloads = filteredContributedValues.map(contributedValue => contributedValue.getValue());

            const valueStream = await this.valueStreamRepo.findAllOverview();

            const data = new Array<ValueStreamsDto>();
            valueStream.map((valueStreamItem) => {
                const filteredPlannedWorkloadsByValueStream = filteredPlannedWorkloads.filter((filterPlannedWorkloadItem) => (
                    filterPlannedWorkloadItem.valueStream.id.toValue() === valueStreamItem.id.toValue()
                    && filterPlannedWorkloadItem.plannedWorkload !== 0
                ));

                const expertiseScopes = filteredPlannedWorkloadsByValueStream.map((item) => new ExpertiseScopeDto (
                            Number(item.contributedValue.expertiseScope.id),
                            item.contributedValue.expertiseScope.name,
                            item.committedWorkload.committedWorkload,
                            item.plannedWorkload,
                            DefaultValue.ACTUAL_PLANNED_WORKLOAD,
                            DefaultValue.WORKLOG,
                        ));

                const valueStreamsDto = new ValueStreamsDto(
                    Number(valueStreamItem.id),
                    valueStreamItem.name,
                    expertiseScopes,
                    );
                data.push(valueStreamsDto);
            });
            const request =
                await this.senteService.getOverviewSumaryYearWorkload<ValueStreamsDto[]>(data, userId.toString());
            const response = request.data;
            const dataResponse = new DataResponseDto(response, true);

            if (dataResponse) {
                return right(Result.ok(dataResponse));
            }

            return left(
                    new GetOverviewSummaryYearErrors.FailToGetOverviewSummaryYear(),
                ) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
