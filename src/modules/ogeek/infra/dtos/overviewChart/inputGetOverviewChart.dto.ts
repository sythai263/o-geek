import { IsNumber } from 'class-validator';

import { DomainId } from '../../../domain/domainId';

export class InputGetOverviewChartDto {
    @IsNumber()
    userId: number | DomainId;

    @IsNumber()
    week: number;
    constructor(userId?: DomainId | number, week?: number) {
        this.userId = userId;
        this.week = week;
    }
}
