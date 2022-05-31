import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DetailCommittedWorkloadsByExpDto } from './DetailCommttedWorkloadsByExp.dto';

export class DetailCommittedWorkloadsDto {
    @ApiProperty()
    @IsArray()
    data: DetailCommittedWorkloadsByExpDto[];
}
