import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class HistoryActualWorkloadDto {
    @ApiProperty({ example: -1 })
    @IsNumber()
    week: number;

    @ApiProperty({ example: 36 })
    @IsNumber()
    actualWorkload?: number;

    @ApiProperty({ example: 'Status mark of PP Ops' })
    @IsString()
    status?: string;

    @ApiProperty({ example: 'Note mark of PP Ops' })
    @IsString()
    note?: string;
}
