import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
export class ExpertiseScopeDto {
    @ApiProperty({ type: UniqueEntityID, example: 135 })
    id?: UniqueEntityID | number;

    @ApiProperty({ example: 'Product UI' })
    name?: string;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
    constructor() {
        this.id = null;
        this.name = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
