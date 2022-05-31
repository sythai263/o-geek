import { IsDate } from 'class-validator';

export class StartAndEndDateOfWeekDto {
    @IsDate()
    startDateOfWeek: Date;

    @IsDate()
    endDateOfWeek: Date;
}
