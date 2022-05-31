import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Query,
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

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { DetailCommittedWorkloadsDto } from '../../../../ogeek/infra/dtos/getDetailCommittedWorkload/DetailCommittedWorkloads.dto';
import { GetDetailCommittedWorkloadErrors } from './GetDetailCommittedWorkloadErrors';
import { GetDetailCommittedWorkloadUseCase } from './GetDetailCommittedWorkloadsUseCase';

@Controller('api/admin/committed-workload/recent')
@ApiTags('Committed Workload')
@ApiBearerAuth()
export class GetDetailCommittedWorkloadController {
    constructor(public readonly useCase: GetDetailCommittedWorkloadUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DetailCommittedWorkloadsDto,
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
    @Roles(RoleType.PP)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async execute(
        @Req() req: Request,
        @Query('userId') userId: number,
    ): Promise<DetailCommittedWorkloadsDto> {
        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetDetailCommittedWorkloadErrors.NotFoundCommittedWorkload:
                    throw new NotFoundException(error.errorValue());
                case GetDetailCommittedWorkloadErrors.NotFoundActualWorklogs:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}
