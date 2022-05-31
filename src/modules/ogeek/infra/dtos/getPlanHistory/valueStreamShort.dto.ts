import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';

export class ValueStreamShortDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Delivery' })
    name: string;

    @IsArray()
    @ApiProperty({ type: ExpertiseScopeShortDto, isArray: true })
    expertiseScopes: ExpertiseScopeShortDto[];
}
