import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class CommittedWorkloadShortDto {
    @ApiProperty({ example: 10 })
    @IsNumber()
    userId: number;

    @IsNumber()
    @ApiProperty({ example: 12 })
    contributedValueId: number;

    @IsNumber()
    @ApiProperty({ example: 4 })
    committedWorkload: number;

    @IsDate()
    @ApiProperty({ example: new Date() })
    startDate: Date;

    @IsDate()
    @ApiProperty({ example: new Date() })
    expiredDate: Date;

    constructor(
        userId?: number,
        contributedValueId?: number,
        committedWorkload?: number,
        startDate?: Date,
        expiredDate?: Date,
    ) {
        this.userId = userId;
        this.contributedValueId = contributedValueId;
        this.committedWorkload = committedWorkload;
        this.startDate = startDate;
        this.expiredDate = expiredDate;
    }
}
