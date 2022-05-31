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
    UsePipes,
    ValidationPipe,
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
import { DataPotentialIssueDto } from '../../../infra/dtos/getPotentialIssue/dataPotentialIssue.dto';
import { InputPotentialIssueDto } from '../../../infra/dtos/getPotentialIssue/inputPotentialIssue.dto';
import { GetPotentialIssueErrors } from './GetPotentialIssueErrors';
import { GetPotentialIssueUseCase } from './GetPotentialIssueUseCases';

@Controller('api/admin/user/potential-issue')
@ApiTags('User')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetPotentialIssueController {
    constructor(public readonly useCase: GetPotentialIssueUseCase) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({
        type: DataPotentialIssueDto,
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
    async getPotentialIssue(
        @Req() req: Request,
        @Query('userId') userId: number,
        @Query('firstDateOfWeek') firstDateOfWeek: Date,
    ): Promise<DataPotentialIssueDto> {
        const inputPotentialIssue = {
            userId,
            firstDateOfWeek,
        } as InputPotentialIssueDto;

        const result = await this.useCase.execute(inputPotentialIssue);

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case GetPotentialIssueErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
