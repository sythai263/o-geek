import { ApiProperty } from '@nestjs/swagger';

export class CreatePlannedWorkloadItemDto {
    @ApiProperty({ example: 20 })
    workload?: number;

    @ApiProperty({ example: 1 })
    committedWorkloadId?: number;
}
