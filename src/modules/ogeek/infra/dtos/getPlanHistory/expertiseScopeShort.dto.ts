import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExpertiseScopeShortDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Product UX' })
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 20 })
    committedWorkload: number;

    @IsNumber()
    @ApiProperty({ example: [18, 20, 22] })
    plannedWorkloads: number[];
}
