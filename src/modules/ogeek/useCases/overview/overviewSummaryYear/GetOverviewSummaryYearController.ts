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

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { DataResponseDto } from '../../../infra/dtos/overviewSummaryYear/dataResponse.dto';
import { GetOverviewSummaryYearErrors } from './GetOverviewSummaryYearErrors';
import { GetOverviewSummaryYearUseCase } from './GetOverviewSummaryYearUseCase';

@Controller('api/overview/summary')
@ApiTags('Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GetOverviewSummaryYearController {
    constructor(public readonly useCase: GetOverviewSummaryYearUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataResponseDto,
        isArray: true,
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
    async getOverviewSummaryYear(
        @Req() req: Request,
    ): Promise<DataResponseDto> {
        const { userId } = req.user as JwtPayload;

        const result = await this.useCase.execute(userId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case GetOverviewSummaryYearErrors.FailToGetOverviewSummaryYear:
                    throw new NotFoundException(error.errorValue());

                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}
