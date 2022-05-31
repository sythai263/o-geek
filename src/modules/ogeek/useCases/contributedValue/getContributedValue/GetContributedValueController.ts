import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
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

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { GetContributedValueShortDto } from '../../../infra/dtos/getContributedValue/getContributedValue.dto';
import { GetContributedValueErrors } from './GetContributedValueErrors';
import { GetContributedValueUseCase } from './GetContributedValueUseCase';

@Controller('api/contributed-values')
@ApiTags('Contributed Value')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetContributedValueController {
    constructor(public readonly useCase: GetContributedValueUseCase) {}

    @Get()
    @Roles(RoleType.PP)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: GetContributedValueShortDto,
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
    async getContributed(): Promise<GetContributedValueShortDto> {
        const result = await this.useCase.execute();
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetContributedValueErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new GetContributedValueShortDto(result.value.getValue());
    }
}
