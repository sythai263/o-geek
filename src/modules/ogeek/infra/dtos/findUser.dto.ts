import { IsString } from 'class-validator';

export class FindUserDto {
    @IsString()
    userId?: number = null;

    @IsString()
    alias?: string = null;
}
