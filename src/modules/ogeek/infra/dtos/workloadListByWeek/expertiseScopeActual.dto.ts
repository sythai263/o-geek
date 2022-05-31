import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExpertiseScopeActualDto {
    @ApiProperty({ example: 'Product Backend' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ example: 12 })
    @IsNumber()
    @IsNotEmpty()
    worklog: number;
}
