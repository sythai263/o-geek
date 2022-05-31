import { IsEmail, IsString } from 'class-validator';

export class UserDTO {
    @IsString()
    readonly id: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly alias: string;
}
