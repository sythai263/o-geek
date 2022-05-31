import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { CreatePotentialIssueDto } from '../../../infra/dtos/createPotentialIssue/createPotentialIssue.dto';
import { PotentialIssueResponseDto } from '../../../infra/dtos/createPotentialIssue/potentialIssueResponse.dto';
import { IssueMap } from '../../../mappers/issueMap';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { CreatePotentialIssueErrors } from './CreatePotentialIssueErrors';
type Response = Either<
    | AppError.UnexpectedError
    | CreatePotentialIssueErrors.UserNotFound
    | CreatePotentialIssueErrors.BadRequest
    | CreatePotentialIssueErrors.Forbidden,
    Result<PotentialIssueResponseDto>
>;

@Injectable()
export class CreatePotentialIssueUseCase
    implements IUseCase<CreatePotentialIssueDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo') public readonly issueRepo: IIssueRepo,
    ) {}
    async execute(
        createPotentialIssue: CreatePotentialIssueDto,
        picId: number,
    ): Promise<Response> {
        try {
            const pic = await this.userRepo.findById(picId);
            if (!pic || !pic.isPeopleOps()) {
                return left(new CreatePotentialIssueErrors.Forbidden());
            }
            const { userId, status, note, firstDateOfWeek } =
                createPotentialIssue;
            const user = await this.userRepo.findById(userId);
            if (!user) {
                return left(
                    new CreatePotentialIssueErrors.UserNotFound(userId),
                );
            }
            if (!status || !note || !firstDateOfWeek) {
                return left(new CreatePotentialIssueErrors.BadRequest());
            }
            const potentialIssue = await this.issueRepo.save(
                userId,
                status,
                note,
                firstDateOfWeek,
                picId,
            );
            if (potentialIssue) {
                const potentialIssueDto =
                    IssueMap.fromDomainCreateIssue(potentialIssue);
                return right(Result.ok(potentialIssueDto));
            }
            return left(
                new CreatePotentialIssueErrors.FailToCreatePotentialIssue(),
            );
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
