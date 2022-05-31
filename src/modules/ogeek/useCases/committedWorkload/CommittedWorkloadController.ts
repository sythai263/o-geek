import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProperty,
    ApiPropertyOptional,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { PageMetaDto } from '../../../../common/dto/PageMetaDto';
import { Roles } from '../../../../decorators/roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import {
    DataHistoryCommittedWorkload,
    FilterHistoryCommittedWorkload,
} from '../..//infra/dtos/historyCommittedWorkload/HistoryCommittedWorkload.dto';
import { CreateCommittedWorkloadDto } from '../../infra/dtos/createCommittedWorkload.dto';
import { CommittedWorkloadShortDto } from '../../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { CreateCommittedWorkloadErrors } from './createCommittedWorkload/CreateCommittedWorkloadErrors';
import { CreateCommittedWorkloadUseCase } from './createCommittedWorkload/CreateCommittedWorkloadUseCase';
import { FilterCommittedWorkload } from './FilterCommittedWorkload';
import { GetCommittedWorkloadUseCase } from './getCommittedWorkload/GetCommittedWorkloadsUseCase';
import { GetHistoryCommittedWorkloadUseCase } from './getHistoryCommittedWorkload/GetCommittedWorkloadsUseCase';
import { UpdateCommittedWorkloadUseCase } from './updateCommittedWorkload/UpdateCommittedWorkloadUseCase';

export class DataCommittedWorkload {
    @ApiProperty({
        type: CommittedWorkloadShortDto,
        isArray: true,
    })
    data: CommittedWorkloadShortDto[];

    @ApiPropertyOptional()
    meta?: PageMetaDto;

    constructor(data: CommittedWorkloadShortDto[], meta?: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
@Controller('api/admin/committed-workloads')
@ApiTags('Committed Workload')
@ApiBearerAuth()
@Roles(RoleType.PP)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommittedWorkloadController {
    constructor(
        public readonly createCommitUseCase: CreateCommittedWorkloadUseCase,
        public readonly getCommitUseCase: GetCommittedWorkloadUseCase,
        public readonly getHistoryCommitUseCase: GetHistoryCommittedWorkloadUseCase,
        public readonly patchCommitUseCase: UpdateCommittedWorkloadUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: DataCommittedWorkload,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiNotFoundResponse({
        description: 'Could not find User :userId .',
    })
    @ApiBadRequestResponse({
        description: 'StartDate or ExpiredDate is not valid !',
    })
    @ApiBadRequestResponse({
        description: 'This user existing committed workload upcoming!',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async execute(
        @Body() body: CreateCommittedWorkloadDto,
        @Req() req: Request,
    ): Promise<DataCommittedWorkload> {
        const createBy = req.user as JwtPayload;
        const result = await this.createCommitUseCase.execute(
            body,
            createBy.userId,
        );
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreateCommittedWorkloadErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                case CreateCommittedWorkloadErrors.DateError:
                    throw new BadRequestException(error.errorValue());
                case CreateCommittedWorkloadErrors.ExistCommittedWorkloadInComing:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new DataCommittedWorkload(result.value.getValue());
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataCommittedWorkload,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiNotFoundResponse({
        description: 'Could not find User :userId .',
    })
    @ApiBadRequestResponse({
        description: 'StartDate or ExpiredDate is not valid !',
    })
    @ApiBadRequestResponse({
        description: 'This user has existing upcoming committed workload.',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    @UsePipes(
        new ValidationPipe({
            transform: true,
        }),
    )
    async getAllCommittedWorkload(
        @Query() query: FilterCommittedWorkload,
    ): Promise<DataCommittedWorkload> {
        const result = await this.getCommitUseCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }

    @Patch()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: DataCommittedWorkload,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiNotFoundResponse({
        description: 'Could not find User :userId .',
    })
    @ApiBadRequestResponse({
        description: 'StartDate or ExpiredDate is not valid !',
    })
    @ApiBadRequestResponse({
        description: 'This user existing committed workload upcoming!',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateCommitted(
        @Body() body: CreateCommittedWorkloadDto,
        @Req() req: Request,
    ): Promise<DataCommittedWorkload> {
        const createBy = req.user as JwtPayload;
        const result = await this.patchCommitUseCase.execute(
            body,
            createBy.userId,
        );
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case CreateCommittedWorkloadErrors.Forbidden:
                    throw new ForbiddenException(error.errorValue());
                case CreateCommittedWorkloadErrors.NotFound:
                    throw new NotFoundException(error.errorValue());
                case CreateCommittedWorkloadErrors.DateError:
                    throw new BadRequestException(error.errorValue());
                case CreateCommittedWorkloadErrors.ExistCommittedWorkloadInComing:
                    throw new BadRequestException(error.errorValue());
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }
        return new DataCommittedWorkload(result.value.getValue());
    }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: DataHistoryCommittedWorkload,
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
        }),
    )
    async getHistoryCommittedWorkload(
        @Query() query: FilterHistoryCommittedWorkload,
    ): Promise<DataHistoryCommittedWorkload> {
        const result = await this.getHistoryCommitUseCase.execute(query);
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                default:
                    throw new InternalServerErrorException(error.errorValue());
            }
        }

        return result.value.getValue();
    }
}
