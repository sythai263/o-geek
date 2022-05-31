import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber } from 'class-validator';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { ValueStreamByWeekDto } from './valueStream.dto';
export class ValueStreamsByWeekDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    week: number;

    @ApiProperty({ example: new Date() })
    @IsDate()
    startDate: Date;

    @ApiProperty({ example: new Date() })
    @IsDate()
    endDate: Date;

    @ApiProperty({ example: PlannedWorkloadStatus.PLANNING })
    @IsEnum(PlannedWorkloadStatus)
    status: PlannedWorkloadStatus;

    @ApiProperty()
    @IsArray()
    valueStreams: ValueStreamByWeekDto[];
}
