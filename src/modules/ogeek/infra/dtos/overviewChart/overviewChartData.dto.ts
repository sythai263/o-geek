import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { WorkloadOverviewDto } from './workloadOverview.dto';

export class OverviewChartDataDto {
    @ApiProperty({
        example: [
            {
                plannedWorkload: 18,
                actualWorkload: 19,
                week: 1,
            },
        ],
    })
    @IsArray()
    expertiseScopes: WorkloadOverviewDto[];

    @ApiProperty({ example: 'Product Backend' })
    @IsString()
    expertiseScope: string;

    @ApiProperty({ example: 1 })
    @IsString()
    expertiseScopeId: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    worklogLength: number;

    @ApiProperty({ example: 6 })
    @IsNumber()
    actualPlannedWorkloadLength: number;
}
