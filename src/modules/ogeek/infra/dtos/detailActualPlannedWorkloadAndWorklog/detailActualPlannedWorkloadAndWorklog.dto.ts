import { ApiProperty } from '@nestjs/swagger';

import { ProjectDto } from './project.dto';

export class DetailActualPlannedWorkloadAndWorklogDto {
    @ApiProperty()
    alias?: string;

    @ApiProperty()
    week?: number;

    @ApiProperty()
    projects?: ProjectDto[];
}
