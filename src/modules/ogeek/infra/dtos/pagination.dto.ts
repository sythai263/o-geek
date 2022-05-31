import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Order } from '../../../../common/constants/order';
import { SortDefault } from '../../../../shared/services/pagination.service';

export class PaginationDto {
    @ApiPropertyOptional({
        enum: Order,
    })
    @IsString()
    @IsOptional()
    order?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sort?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    take?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    q?: string;
}

export class SearcnPaginationDto extends PaginationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string;
}

export class PaginationRepoDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiProperty()
    @IsOptional()
    order?: SortDefault;
}

export class PaginationResponseDto {
    @ApiProperty({ example: 25 })
    @IsNumber()
    itemCount: number;

    @ApiProperty({ example: 3 })
    @IsNumber()
    pageCount: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    page: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    take: number;

    constructor(page: number, take: number, itemCount: number) {
        this.page = page;
        this.take = take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(itemCount / this.take);
    }
}
