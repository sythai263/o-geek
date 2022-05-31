import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class WorkloadOverviewDto {
    // @ApiProperty({ example: 'Product UX' })
    // @IsString()
    // expertiseScope: string;

    @ApiProperty({ example: '15' })
    @IsNumber()
    plannedWorkload: number;

    @ApiProperty({ example: '15' })
    @IsString()
    actualWorkload: number;

    @ApiProperty({ example: '1' })
    @IsNumber()
    week: number;
}
