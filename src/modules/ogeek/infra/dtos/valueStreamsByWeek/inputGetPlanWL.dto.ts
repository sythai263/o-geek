import { IsDate, IsNumber } from 'class-validator';

import { DomainId } from '../../../domain/domainId';

export class InputGetPlanWLDto {
    @IsNumber()
    userId: number | DomainId;

    @IsDate()
    startDateOfWeek: Date;

    @IsDate()
    endDateOfWeek: Date;
}
