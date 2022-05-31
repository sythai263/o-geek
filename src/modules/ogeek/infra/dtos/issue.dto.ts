import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

import { IssueStatus } from '../../../../common/constants/issueStatus';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { UserDto } from './user.dto';
export class IssueDto {
    @ApiProperty({ type: UniqueEntityID, example: 122 })
    @IsNotEmpty()
    id: UniqueEntityID | number;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsOptional()
    status?: IssueStatus;

    @ApiProperty({ type: () => UserDto })
    @IsOptional()
    user?: UserDto;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    firstDateOfWeek: Date;

    @ApiProperty({ example: 'Potential issue of Geek' })
    @IsOptional()
    note?: string;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsOptional()
    updatedAt?: Date;
}
