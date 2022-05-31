import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../../common/constants/roleType';
import { Roles } from '../../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../../jwtAuth/jwtAuth.strategy';
import { CreatePotentialIssueDto } from '../../../infra/dtos/createPotentialIssue/createPotentialIssue.dto';
import { PotentialIssueResponseDto } from '../../../infra/dtos/createPotentialIssue/potentialIssueResponse.dto';
import { CreatePotentialIssueErrors } from './CreatePotentialIssueErrors';
import { CreatePotentialIssueUseCase } from './CreatePotentialIssueUseCase';

@Controller('api/admin/user/potential-issue')
@ApiTags('User')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreatePotentialIssueController {
    constructor(public readonly useCase: CreatePotentialIssueUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: PotentialIssueResponseDto,
        description: 'OK',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    async execute(
        @Body() createPotentialIssue: CreatePotentialIssueDto,
        @Req() req: Request,
    ): Promise<PotentialIssueResponseDto> {
        const { userId: picId } = req.user as JwtPayload;
        const result = await this.useCase.execute(createPotentialIssue, picId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreatePotentialIssueErrors.FailToCreatePotentialIssue:
                    throw new BadRequestException(error.errorValue());
                case CreatePotentialIssueErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case CreatePotentialIssueErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreatePotentialIssueErrors.BadRequest:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
