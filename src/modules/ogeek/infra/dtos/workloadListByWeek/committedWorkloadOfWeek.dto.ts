import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CommittedWorkloadByWeekDto {
    @ApiProperty({ example: '01/01/2022', default: '' })
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({ example: '01/04/2022', default: '' })
    @IsDateString()
    @IsNotEmpty()
    expiredDate: Date;

    @ApiProperty({ example: 12, default: 0 })
    @IsNumber()
    @IsNotEmpty()
    workload: number;

    @ApiProperty({ example: '01/04/2022', default: '' })
    @IsDateString()
    @IsNotEmpty()
    updatedAt: Date;
}
