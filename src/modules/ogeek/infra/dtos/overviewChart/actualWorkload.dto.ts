import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { DomainId } from '../../../domain/domainId';

export class ActualWorkloadDto {
    @ApiProperty()
    @IsString()
    valueStream: string;

    @ApiProperty()
    @IsNumber()
    contributedValueId: number | DomainId;

    @ApiProperty()
    @IsString()
    expertiseScope: string;

    @ApiProperty()
    @IsNumber()
    valueStreamId: number | DomainId;

    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    actualPlan: number;

    @ApiProperty()
    @IsNumber()
    worklog: number;

    @ApiProperty()
    @IsString()
    week: string;
}
