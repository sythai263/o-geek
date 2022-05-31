import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
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
import { DataPotentialIssuesDto } from '../../..//infra/dtos/getPotentialIssues/dataPotentialIssues.dto';
import { GetPotentialIssuesInputDto } from '../../../infra/dtos/getPotentialIssues/getPotentialIssuesInput.dto';
import { MessageIssueDto } from '../../../infra/dtos/getPotentialIssues/messageIssues.dto';
import { GetPotentialIssuesErrors } from './GetPotentialIssuesErrors';
import { GetPotentialIssuesUseCase } from './GetPotentialIssuesUseCase';

@Controller('api/admin/user/:userId/potential-issue/history')
@ApiTags('User')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetPotentialIssuesController {
    constructor(public readonly useCase: GetPotentialIssuesUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({
        type: DataPotentialIssuesDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: 'Not Found',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(
        @Req() req: Request,
        @Param('userId') userId: number,
        @Query('startWeek') startWeek: number,
        @Query('startYear') startYear: number,
        @Query('endWeek') endWeek: number,
        @Query('endYear') endYear: number,
    ): Promise<MessageIssueDto> {
        const getPotentialIssuesInputDto = {
            userId,
            startWeek,
            startYear,
            endWeek,
            endYear,
        } as GetPotentialIssuesInputDto;

        const result = await this.useCase.execute(getPotentialIssuesInputDto);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetPotentialIssuesErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case GetPotentialIssuesErrors.GetPotentialIssuesFailed:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new MessageIssueDto(
            HttpStatus.OK,
            'Get history potential issue successfully',
            result.value.getValue(),
        );
    }
}
