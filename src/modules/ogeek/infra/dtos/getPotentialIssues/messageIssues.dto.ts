import { ApiProperty } from '@nestjs/swagger';

import { DataPotentialIssuesDto } from './dataPotentialIssues.dto';
export class MessageIssueDto {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: "Can't create committed workloads." })
    message: string;

    @ApiProperty({ isArray: true })
    data?: DataPotentialIssuesDto[];

    constructor(
        statusCode: number,
        message: string,
        data?: DataPotentialIssuesDto[],
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
