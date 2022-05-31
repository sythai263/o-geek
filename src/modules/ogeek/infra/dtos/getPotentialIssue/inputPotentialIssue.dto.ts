import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class InputPotentialIssueDto {
    @ApiProperty({ example: 56 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    firstDateOfWeek: Date;
}
