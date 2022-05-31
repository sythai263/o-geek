import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DetailCommittedWorkloadsByExpAndWeekDto } from './DetailCommttedWorkloadsByExp.dto';

export class DetailCommittedWorkloadsByWeekDto {
    @ApiProperty()
    @IsArray()
    data: DetailCommittedWorkloadsByExpAndWeekDto[];
}
