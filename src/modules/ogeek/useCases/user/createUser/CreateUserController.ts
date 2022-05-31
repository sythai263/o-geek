import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    NotFoundException,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '../../../../headerApiKeyAuth/headerApiKeyAuth.guard';
import { UserDto } from '../../../infra/dtos/user.dto';
import { FailToCreateUserErrors } from './CreateUserErrors';
import { CreateUserUseCase } from './CreateUserUseCase';

@Controller('api/admin/user')
@ApiTags('User')
export class CreateUserController {
    constructor(public readonly useCase: CreateUserUseCase) {}

    @ApiHeader({
        name: 'x-api-key',
        description: 'api key to access o-geek product',
    })
    @UseGuards(ApiKeyAuthGuard)
    @Post()
    @ApiCreatedResponse({
        type: UserDto,
        description: 'Created',
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
    async execute(@Body() userDto: UserDto): Promise<UserDto> {
        const result = await this.useCase.execute(userDto);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case FailToCreateUserErrors.FailToCreateUser:
                    throw new BadRequestException(error.errorValue());
                case FailToCreateUserErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
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
