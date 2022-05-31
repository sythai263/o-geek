import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsFQDN, IsNotEmpty, IsOptional } from 'class-validator';

import { RoleType } from '../../../../common/constants/roleType';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserEntity } from '../database/entities/user.entity';

export class UserDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(77),
    })
    id: UniqueEntityID;

    @ApiProperty({ example: 'thai.ls' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
    alias: string;

    @ApiProperty({ example: 'Sỹ Thái' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
    name: string;

    @ApiProperty({ example: '0984786432' })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'thai.ls@geekup.vn' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'http://localhost/avatar' })
    @IsFQDN()
    avatar: string;

    @ApiProperty({ enum: RoleType, example: RoleType.USER })
    role: RoleType;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    updatedAt?: Date;

    constructor(user?: UserEntity) {
        if (user) {
            this.alias = user.alias;
            this.id = new UniqueEntityID(user.id);
            this.name = user.name;
            this.email = user.email;
            this.phone = user.phone;
            this.avatar = user.avatar;
            this.role = user.role;
            this.createdAt = user.createdAt;
            this.updatedAt = user.updatedAt;
        }
    }
}
