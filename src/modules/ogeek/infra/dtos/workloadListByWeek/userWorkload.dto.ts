import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';

export class UserWorkloadDto {
    @ApiProperty({ example: 'tuan.lq' })
    @IsString()
    @IsNotEmpty()
    alias: string;

    @ApiProperty({ type: UniqueEntityID, example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number | UniqueEntityID;

    @ApiProperty({ example: 'https://avatar.com' })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}
