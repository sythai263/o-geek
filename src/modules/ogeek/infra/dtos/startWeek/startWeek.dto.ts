import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StartWeekDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '2022-04-02 07:00:00+07' })
    startDate: Date;
}
