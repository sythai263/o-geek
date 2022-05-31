import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
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
import * as moment from 'moment';

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { StartWeekDto } from '../../../infra/dtos/startWeek/startWeek.dto';
import { StartWeekErrors } from './StartWeekErrors';
import { StartWeekUseCase } from './StartWeekUseCase';

@Controller('api/planned-workload')
@ApiTags('Planned Workload')
export class StartWeekController {
    constructor(public readonly useCase: StartWeekUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('start-week')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: MessageDto,
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
        @Body() startWeekDto: StartWeekDto,
    ): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const { userId } = findUserDto;

        const { startDate } = startWeekDto;
        const result = await this.useCase.execute(startDate, userId);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case StartWeekErrors.PreviousWeekNotClose:
                    throw new BadRequestException(error.errorValue());
                case StartWeekErrors.NotPlan:
                    throw new BadRequestException(error.errorValue());
                case StartWeekErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        const executingWeek = moment(startDate).week();

        return {
            statusCode: HttpStatus.OK,
            message: 'Start week successfully',
            data: {
                week: executingWeek.toString(),
            },
        } as MessageDto;
    }
}
