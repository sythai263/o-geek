import {
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { DataCommittingWorkload } from '../../../infra/dtos/updateCommittingWorkload/updateCommittingWorkload.dto';
import { UpdateCommittingWorkloadErrors } from './UpdateCommittingWorkloadErrors';
import { UpdateCommittingWorkloadUseCase } from './UpdateCommittingWorkloadUseCase';

@Controller('api/admin/committed-workload/committing')
@ApiTags('Committed Workload')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateCommittingWorkloadController {
    constructor(public readonly useCase: UpdateCommittingWorkloadUseCase) {}

    @Patch()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataCommittingWorkload,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiNotFoundResponse({
        description: 'Could not find User :userId .',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Query('userId') userId: number,
        @Req() req: Request,
    ): Promise<DataCommittingWorkload> {
        const updatedBy = req.user as JwtPayload;
        const result = await this.useCase.execute(userId, updatedBy.userId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case UpdateCommittingWorkloadErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case UpdateCommittingWorkloadErrors.NotFound:
                    throw new NotFoundException(error.errorValue());

                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
