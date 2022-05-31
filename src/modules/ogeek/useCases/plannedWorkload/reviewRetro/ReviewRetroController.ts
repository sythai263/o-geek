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
import { ReviewRetroErrors } from './ReviewRetroErrors';
import { ReviewRetroUseCase } from './ReviewRetroUseCase';

@Controller('api/planned-workload')
@ApiTags('Planned Workload')
export class ReviewRetroController {
    constructor(public readonly useCase: ReviewRetroUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('review-retro')
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
                case ReviewRetroErrors.NotStartWeek:
                    throw new BadRequestException(error.errorValue());
                case ReviewRetroErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }

        // return { week: moment(startDate).week() } as StartWeekResponseDto;
        const reviewRetroWeek = moment(startDate).week();
        return {
            statusCode: HttpStatus.OK,
            message: 'Review retro successfully',
            data: {
                week: reviewRetroWeek.toString(),
            },
        } as MessageDto;
    }
}
