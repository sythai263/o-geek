import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MinDate } from 'class-validator';

export class NotificationDto {
    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ID_FIELD' })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: 'Admin has added 45 hr (s) committed workload for you.',
    })
    @IsNotEmpty({ message: 'ERROR_EMPTY_MESSAGE_FIELD' })
    notificationMessage: string;

    @ApiProperty({ example: 'UNREAD' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_READ_FIELD' })
    read: string;

    @ApiProperty({ example: new Date() })
    @IsNotEmpty({ message: 'ERROR_EMPTY_TIME_FIELD' })
    @MinDate(new Date())
    createdAt: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
}
