import { ApiProperty } from '@nestjs/swagger';

import { ValueStreamsDto } from './valueStreams.dto';

export class DataResponseDto {
    @ApiProperty()
    data: ValueStreamsDto[];

    @ApiProperty()
    success: boolean;

    constructor(data?: ValueStreamsDto[], success?: boolean) {
        this.data = data;
        this.success = success;
    }
}
