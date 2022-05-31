import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { UserDto } from '../../../infra/dtos/user.dto';
import { GetUserErrors } from './GetUserErrors';
import { GetUserUseCase } from './GetUserUseCase';

@Controller('api/user')
@ApiTags('User')
export class GetUserController {
    constructor(public readonly useCase: GetUserUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: UserDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(@Req() req: Request): Promise<UserDto> {
        const jwtPayload = req.user as JwtPayload;
        const userDto = new UserDto();
        userDto.id = new UniqueEntityID(jwtPayload.userId);
        userDto.role = jwtPayload.role;

        const result = await this.useCase.execute(userDto);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetUserErrors.UserNotFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get user by userId',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'server error!! ',
                    );
            }
        }

        return result.value.getValue();
    }
}
