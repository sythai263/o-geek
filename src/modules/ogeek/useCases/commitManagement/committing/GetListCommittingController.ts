import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
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
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import {
    DataListCommittingWorkload,
    FilterListCommittingWorkload,
} from '../../../infra/dtos/commitManagement/committing/committing.dto';
import { GetListCommittingErrors } from './GetListCommittingErrors';
import { GetListCommittingUseCase } from './GetListCommittingUseCase';

@Controller('api/admin/committed-workload/committing')
@ApiTags('Committed Workload')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetListCommittingController {
    constructor(public readonly useCase: GetListCommittingUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataListCommittingWorkload,
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
        }),
    )
    async execute(
        @Query() query: FilterListCommittingWorkload,
    ): Promise<DataListCommittingWorkload> {
        const result = await this.useCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetListCommittingErrors.ListCommittingNotFound:
                    throw new NotFoundException(error.errorValue());

                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
