import { IsDate, IsNumber } from 'class-validator';

import { DomainId } from '../../../domain/domainId';

export class InputGetOverviewChartDataDto {
    @IsNumber()
    userId: number | DomainId;

    @IsDate()
    startDateInWeek: Date;
}
