import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class StartWeekResponseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '6' })
    @Min(1)
    @Max(52)
    week: number;
}
