import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';

export class StartEndDateOfWeekWLInputDto {
    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    startDateOfWeek: Date;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    endDateOfWeek: Date;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    userId?: number;
}
