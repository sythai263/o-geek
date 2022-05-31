import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
export class WorkloadDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsInt()
    valueStreamId: number;

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @IsInt()
    expertiseScopeId: number;

    @ApiProperty({ example: 40 })
    @IsNotEmpty()
    @Min(0)
    @Max(50)
    workload: number;
}
