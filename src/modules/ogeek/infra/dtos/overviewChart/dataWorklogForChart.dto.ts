import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { DataExpertiseScopeDto } from './dataWorkload.dto';

export class DataWorklogDto {
    @ApiProperty()
    @IsString()
    alias: string;

    @ApiProperty()
    @IsArray()
    expertiseScopes: DataExpertiseScopeDto[];

    @ApiProperty()
    @IsNumber()
    week: number;
}
