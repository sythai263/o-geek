import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { ExpertiseScopeDto } from '../expertiseScope.dto';

export class ExpertiseScopeWithinWorkloadListDto {
    @ApiProperty({
        type: () => ExpertiseScopeDto,
        example: { id: 1, name: 'Product Backend' },
    })
    @IsOptional()
    expertiseScope: ExpertiseScopeDto;

    @ApiProperty({ example: '20' })
    @IsNumber()
    @IsOptional()
    committedWorkload: number;

    @ApiProperty({ example: '12' })
    @IsNumber()
    @IsOptional()
    plannedWorkload: number;

    @ApiProperty({ example: '10' })
    @IsString()
    @IsOptional()
    worklog: number;
}
