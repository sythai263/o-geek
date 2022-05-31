import { ApiProperty } from '@nestjs/swagger';

import { IterationDto } from './iteration.dto';

export class ProjectDto {
    @ApiProperty()
    project?: string;

    @ApiProperty()
    iterations?: IterationDto[];
}
