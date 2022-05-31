import {
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { NotificationDto } from '../../../infra/dtos/notification/getNotifications/getNotification.dto';
import { GetNotificationErrors } from './GetNotificationErrors';
import { GetNotificationUseCase } from './GetNotificationUseCase';

@Controller('api/user/notification')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GetNotificationController {
    constructor(public readonly useCase: GetNotificationUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: NotificationDto,
        isArray: true,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(@Req() req: Request): Promise<NotificationDto[]> {
        const { userId } = req.user as JwtPayload;

        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetNotificationErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case GetNotificationErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
