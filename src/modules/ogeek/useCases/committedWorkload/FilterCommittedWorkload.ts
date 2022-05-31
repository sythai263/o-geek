import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../common/constants/committedStatus';
import { SortBy } from '../../../../common/constants/sortBy';
import { PageOptionsDto } from '../../../../common/dto/PageOptionsDto';

export class FilterCommittedWorkload extends PageOptionsDto {
    @ApiPropertyOptional({
        description: 'Filter by User ID',
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({
        description: 'Search data by alias',
    })
    @Type(() => String)
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by status of committed workload',
        enum: CommittedWorkloadStatus,
    })
    @IsEnum(CommittedWorkloadStatus)
    @IsOptional()
    status?: CommittedWorkloadStatus;

    @ApiPropertyOptional({
        enum: SortBy,
        default: SortBy.ID,
        description: 'Sort by field',
    })
    @IsEnum(SortBy)
    @IsOptional()
    sortBy?: SortBy = SortBy.ID;
}
