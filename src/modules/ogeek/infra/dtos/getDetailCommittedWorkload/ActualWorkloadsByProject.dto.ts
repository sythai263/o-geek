import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

import { ActualWorkloadByWeekDto } from './ActualWorkloadByWeek.dto';

export class ActualWorklogsByProjectDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    projectId: number;

    @ApiProperty({ example: 'Product UX' })
    @IsString()
    projectName: string;

    @ApiProperty({ type: new Array<ActualWorkloadByWeekDto>() })
    @IsArray()
    actualWorklogs: ActualWorkloadByWeekDto[];
}
