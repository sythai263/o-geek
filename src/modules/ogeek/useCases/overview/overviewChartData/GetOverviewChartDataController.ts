import {
    Controller,
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
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { MomentService } from '../../../../../providers/moment.service';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { OverviewChartDataDto } from '../../../infra/dtos/overviewChart/overviewChartData.dto';
import { GetOverviewChartDataErrors } from './GetOverviewChartDataErrors';
import { GetOverviewChartDataUseCase } from './GetOverviewChartDataUseCase';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/overview/chart')
@ApiTags('Overview')
export class OverviewChartDataController {
    constructor(public readonly useCase: GetOverviewChartDataUseCase) {}
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: OverviewChartDataDto,
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
    async execute(@Req() req: Request): Promise<OverviewChartDataDto[]> {
        const currentWeek = MomentService.getCurrentWeek();
        const { userId } = req.user as JwtPayload;

        const result = await this.useCase.execute(currentWeek, userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetOverviewChartDataErrors.GetOverviewChartDataFailed:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get data for overview chart by ID',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Cannot get data for overview chart',
                    );
            }
        }
        return result.value.getValue();
    }
}
