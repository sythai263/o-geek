import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { Issue } from '../../../domain/issue';
import { UpdatePotentialIssueDto } from '../../../infra/dtos/updatePotentialIssue/updatePotentialIssue.dto';
import { IssueMap } from '../../../mappers/issueMap';
import { IIssueRepo } from '../../../repos/issueRepo';
import { IUserRepo } from '../../../repos/userRepo';
import { UpdatePotentialIssueErrors } from './UpdatePotentialIssueErrors';

type Response = Either<
    | AppError.UnexpectedError
    | UpdatePotentialIssueErrors.UserNotFound
    | UpdatePotentialIssueErrors.BadRequest
    | UpdatePotentialIssueErrors.Forbidden,
    Result<UpdatePotentialIssueDto>
>;

@Injectable()
export class UpdatePotentialIssueUseCase
    implements IUseCase<UpdatePotentialIssueDto | number, Promise<Response>>
{
    constructor(
        @Inject('IUserRepo') public readonly userRepo: IUserRepo,
        @Inject('IIssueRepo') public readonly issueRepo: IIssueRepo,
    ) {}
    async execute(
        updatePotentialIssue: UpdatePotentialIssueDto,
        picId: number,
    ): Promise<Response> {
        try {
            const pic = await this.userRepo.findById(picId);
            if (!pic || !pic.isPeopleOps()) {
                return left(new UpdatePotentialIssueErrors.Forbidden());
            }
            const { id, status, note } = updatePotentialIssue;

            const potentialIssue = await this.issueRepo.findById(id);
            if (!potentialIssue) {
                return left(new UpdatePotentialIssueErrors.NotFound(id));
            }
            if (
                Issue.checkStatusResolved(status) &&
                potentialIssue.isPotentialIssue()
            ) {
                potentialIssue.markResolvedAndNote(note);
            }
            if (potentialIssue.isPotentialIssue()) {
                potentialIssue.note = note;
            }

            const potentialIssueEntity = IssueMap.toEntity(potentialIssue);
            await this.issueRepo.update(potentialIssueEntity);
            if (potentialIssue) {
                const potentialIssueDto =
                    IssueMap.fromDomainUpdateIssue(potentialIssue);
                return right(Result.ok(potentialIssueDto));
            }
            return left(
                new UpdatePotentialIssueErrors.FailToUpdatePotentialIssue(),
            );
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
