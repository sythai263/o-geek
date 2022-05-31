import {
    Controller,
    Get,
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

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { InputWeekDto } from '../../../infra/dtos/valueStreamsByWeek/inputWeekDto';
import { ValueStreamsByWeekDto } from '../../../infra/dtos/valueStreamsByWeek/valueStreamsByWeek.dto';
import { GetValueStreamError } from './GetValueStreamErrors';
import { GetValueStreamUseCase } from './GetValueStreamUseCase';

@Controller('api/value-stream')
@ApiTags('Value Stream')
export class GetValueStreamController {
    constructor(public readonly useCase: GetValueStreamUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOkResponse({
        type: ValueStreamsByWeekDto,
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
    async execute(
        @Req() req: Request,
        @Query() { week }: InputWeekDto,
    ): Promise<ValueStreamsByWeekDto> {
        const { userId } = req.user as JwtPayload;
        const result = await this.useCase.execute(week, userId);
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetValueStreamError.FailToGetValueStream:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get value stream by week',
                    );
                case GetValueStreamError.NoCommittedWorkloadFound:
                    throw new NotFoundException(
                        error.errorValue(),
                        'Can not get value stream by week',
                    );
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something wrong happended',
                    );
            }
        }
        return result.value.getValue();
    }
}
