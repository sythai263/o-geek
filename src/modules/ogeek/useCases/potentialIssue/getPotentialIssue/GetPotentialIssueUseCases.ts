import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { DataPotentialIssueDto } from '../../../infra/dtos/getPotentialIssue/dataPotentialIssue.dto';
import { InputPotentialIssueDto } from '../../../infra/dtos/getPotentialIssue/inputPotentialIssue.dto';
import { IssueMap } from '../../../mappers/issueMap';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { GetPotentialIssueErrors } from './GetPotentialIssueErrors';
type Response = Either<
    AppError.UnexpectedError | GetPotentialIssueErrors.NotFound,
    Result<DataPotentialIssueDto>
>;

@Injectable()
export class GetPotentialIssueUseCase
    implements IUseCase<InputPotentialIssueDto, Promise<Response>>
{
    constructor(
        @Inject('IIssueRepo')
        public readonly potentialIssueRepo: IIssueRepo,
        @Inject('IUserRepo')
        public readonly userRepo: IUserRepo,
    ) {}
    async execute(query: InputPotentialIssueDto): Promise<Response> {
        try {
            const potentialIssue =
                await this.potentialIssueRepo.findByUserIdAndWeek(query);
            const pic = await this.userRepo.findById(potentialIssue?.createdBy);

            if (!potentialIssue) {
                return left(new GetPotentialIssueErrors.NotFound());
            }
            const potentialIssueDto = IssueMap.fromDomainOne(potentialIssue);

            const dataPotentialIssueDto = {
                ...potentialIssueDto,
                picName: pic.alias,
            } as DataPotentialIssueDto;

            return right(Result.ok(dataPotentialIssueDto));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
