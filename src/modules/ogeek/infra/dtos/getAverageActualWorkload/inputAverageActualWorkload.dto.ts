import { IsDate, IsNumber } from 'class-validator';

import { DomainId } from '../../../domain/domainId';

export class InputGetAverageActualWorkloadDto {
    @IsNumber()
    userId: number | DomainId;

    @IsDate()
    currentDate: Date;

    constructor(userId?: DomainId | number, currentDate?: Date) {
        this.userId = userId;
        this.currentDate = currentDate;
    }
}
