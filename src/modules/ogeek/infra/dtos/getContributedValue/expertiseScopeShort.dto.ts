import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExpertiseScopeShortDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Product Design' })
    @IsString()
    name?: string;

    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}
