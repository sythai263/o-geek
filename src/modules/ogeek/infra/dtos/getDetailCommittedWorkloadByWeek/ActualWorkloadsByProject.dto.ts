import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';
export class ActualWorklogsByProjectAndWeekDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    projectId: number;

    @ApiProperty({ example: 'Product UX' })
    @IsString()
    projectName: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    week: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    actualWorklog: number;
}
