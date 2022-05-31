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

import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { MessageDto } from '../../../infra/dtos/message.dto';
import { WeekDto } from '../../../infra/dtos/week.dto';
import { GetPlannedWorkloadHistoryErrors } from './GetPlannedWorkloadHistoryErrors';
import { GetPlannedWorkloadHistoryUseCase } from './GetPlannedWorkloadHistoryUseCase';

@Controller('api/planned-workload')
@ApiTags('Planned Workload')
export class GetPlannedWorkloadHistoryController {
    constructor(public readonly useCase: GetPlannedWorkloadHistoryUseCase) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('history')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: MessageDto,
        description: 'OKE',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Interal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Query('week') week: number,
        @Query('year') year: number,
    ): Promise<MessageDto> {
        const jwtPayload = req.user as JwtPayload;
        const findUserDto = { ...jwtPayload } as FindUserDto;
        const userId = findUserDto.userId;

        const weekDto = new WeekDto(week, year);

        const result = await this.useCase.execute(weekDto, userId);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetPlannedWorkloadHistoryErrors.GetPlannedWorkloadHistoryFailed:
                    throw new NotFoundException(error.errorValue());
                case GetPlannedWorkloadHistoryErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(
                        error.errorValue(),
                        'Something went wrong',
                    );
            }
        }
        const { notes, valueStreams } = result.value.getValue();
        return {
            statusCode: HttpStatus.OK,
            message: 'Get planned workload history successfully',
            data: { notes, valueStreams },
        } as MessageDto;
    }
}
