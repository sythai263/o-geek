import { ApiProperty } from '@nestjs/swagger';

import { ValueStreamShortInsertDto } from './valueStreamShort.dto';
export class GetContributedValueShortDto {
    @ApiProperty({ type: ValueStreamShortInsertDto, isArray: true })
    data: ValueStreamShortInsertDto[];

    constructor(data: ValueStreamShortInsertDto[]) {
        this.data = data;
    }
}
