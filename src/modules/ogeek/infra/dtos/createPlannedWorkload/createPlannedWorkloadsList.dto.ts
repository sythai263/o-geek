import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { CreatePlannedWorkloadItemDto } from './createPlannedWorkloadItem.dto';

export class CreatePlannedWorkloadsListDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    startDate?: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Early Bird' })
    reason?: string;

    @IsArray()
    @ApiProperty({ isArray: true, type: CreatePlannedWorkloadItemDto })
    plannedWorkloads?: CreatePlannedWorkloadItemDto[];
}
