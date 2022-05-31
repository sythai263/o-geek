import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

import { WorkloadDto } from './workload.dto';

export class CreateCommittedWorkloadDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @ApiProperty({ type: () => WorkloadDto, isArray: true })
    @IsArray()
    @IsNotEmpty()
    committedWorkloads: WorkloadDto[];

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @ApiProperty({ example: new Date() })
    @IsNotEmpty()
    expiredDate: Date;
}
