import { ApiProperty } from '@nestjs/swagger';

export class UserShortDto {
    @ApiProperty({ example: 1 })
    id?: number;

    @ApiProperty({ example: 'thai.ls' })
    alias?: string;

    constructor(id?: number, alias?: string) {
        this.id = id;
        this.alias = alias;
    }
}
export class DataUserShortDto {
    @ApiProperty({ type: UserShortDto, isArray: true })
    data?: UserShortDto[];
    constructor(data?: UserShortDto[]) {
        this.data = data;
    }
}
