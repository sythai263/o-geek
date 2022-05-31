/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { FindUserDto } from '../../../infra/dtos/findUser.dto';
import { UserShortDto } from '../../../infra/dtos/getUsers/getUsersDto';
import { UserMap } from '../../../mappers/userMap';
import { IUserRepo } from '../../../repos/userRepo';
import { GetUserErrors } from './GetUsersErrors';

type Response = Either<
    AppError.UnexpectedError,
    Result<UserShortDto[]>
>;

@Injectable()
export class GetUsersUseCase
    implements IUseCase<FindUserDto , Promise<Response> > {
    constructor(
        @Inject('IUserRepo') public readonly repo: IUserRepo,
    ) {}

    async execute(): Promise<Response> {
        try {
            const users = await this.repo.findAllUser();
            if (!users) {
                return left(new GetUserErrors.NoUsers());
            }
            const data = UserMap.toArrayUserShort(users);
            return right(Result.ok(data));

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
