import { ApiProperty } from '@nestjs/swagger';
export class MessageDto {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: "Can't create committed workloads." })
    message: string;

    @ApiProperty({ isArray: true })
    data?: Record<string, unknown>;

    constructor(
        statusCode: number,
        message: string,
        data?: Record<string, unknown>,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
