import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
export class ValueStreamDto {
    @ApiProperty({ type: UniqueEntityID, example: 122 })
    id: UniqueEntityID | number;

    @ApiProperty({ example: 'Delivery' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    updatedAt?: Date;

    constructor() {
        this.id = null;
        this.name = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
