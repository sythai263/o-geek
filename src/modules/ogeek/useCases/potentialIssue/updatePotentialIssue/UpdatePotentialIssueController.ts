import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
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
import { UpdatePotentialIssueDto } from '../../../infra/dtos/updatePotentialIssue/updatePotentialIssue.dto';
import { UpdatePotentialIssueErrors } from './UpdatePotentialIssueErrors';
import { UpdatePotentialIssueUseCase } from './UpdatePotentialIssueUseCase';

@Controller('api/admin/user/potential-issue')
@ApiTags('User')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdatePotentialIssueController {
    constructor(public readonly useCase: UpdatePotentialIssueUseCase) {}

    @Patch()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: UpdatePotentialIssueDto,
        description: 'Created',
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
        @Body() updatePotentialIssue: UpdatePotentialIssueDto,
        @Req() req: Request,
    ): Promise<UpdatePotentialIssueDto> {
        const { userId: picId } = req.user as JwtPayload;
        const result = await this.useCase.execute(updatePotentialIssue, picId);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case UpdatePotentialIssueErrors.FailToUpdatePotentialIssue:
                    throw new BadRequestException(error.errorValue());
                case UpdatePotentialIssueErrors.UserNotFound:
                    throw new NotFoundException(error.errorValue());
                case UpdatePotentialIssueErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                case UpdatePotentialIssueErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case UpdatePotentialIssueErrors.BadRequest:
                    throw new BadRequestException(error.errorValue());

                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return result.value.getValue();
    }
}
