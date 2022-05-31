import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

import { ExpertiseScopeActualDto } from './expertiseScopeActual.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class ActualWorkloadListDto {
    @ApiProperty({ type: UserWorkloadDto })
    @IsNotEmpty()
    user: UserWorkloadDto;

    @ApiProperty({ type: ExpertiseScopeActualDto, isArray: true })
    @IsArray()
    @IsNotEmpty()
    expertiseScopes: ExpertiseScopeActualDto[];

    @ApiProperty({ example: 12 })
    @IsNumber()
    @IsNotEmpty()
    actualWorkload: number;
}
