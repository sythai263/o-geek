import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SenteService } from '../../../../../shared/services/sente.service';
import {
    DetailActualPlannedWorkloadAndWorklogDto,
    InputDetailPlannedWorkloadAndWorklogDto,
} from '../../../infra/dtos/detailActualPlannedWorkloadAndWorklog';
import { ProjectDto } from '../../../infra/dtos/detailActualPlannedWorkloadAndWorklog/project.dto';
import { IUserRepo } from '../../../repos/userRepo';

type Response = Either<
    AppError.UnexpectedError,
    Result<DetailActualPlannedWorkloadAndWorklogDto>
>;

@Injectable()
export class GetDetailActualPlannedWorkloadUseCase
    implements
        IUseCase<InputDetailPlannedWorkloadAndWorklogDto, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        public readonly senteService: SenteService,
    ) {}

    async execute(
        inputDetailPlannedWorkloadAndWorklog: InputDetailPlannedWorkloadAndWorklogDto,
    ): Promise<Response> {
        try {
            const user = await this.userRepo.findById(
                inputDetailPlannedWorkloadAndWorklog.userId,
            );

            const request = await this.senteService.getDetailedActualWorkload(
                inputDetailPlannedWorkloadAndWorklog,
            );
            const projects = request.data as ProjectDto[];

            const response = new DetailActualPlannedWorkloadAndWorklogDto();
            response.alias = user.alias;
            response.week = inputDetailPlannedWorkloadAndWorklog.week;
            response.projects = projects;

            return right(Result.ok(response));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
