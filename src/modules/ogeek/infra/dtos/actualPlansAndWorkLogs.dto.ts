import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class ActualPlanAndWorkLogDto {
    @ApiProperty()
    @IsString()
    valueStream: string;

    @ApiProperty()
    @IsNumber()
    contributedValueId: number | UniqueEntityID;

    @ApiProperty()
    @IsString()
    expertiseScope: string;

    @ApiProperty()
    @IsNumber()
    valueStreamId: number | UniqueEntityID;

    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    actualPlannedWorkload: number;

    @ApiProperty()
    @IsNumber()
    worklog: number;

    @ApiProperty()
    @IsString()
    week: string;
}
