import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { UserDto } from '../../../../ogeek/infra/dtos/user.dto';
import { UserMap } from '../../../../ogeek/mappers/userMap';
import { User } from '../../../domain/user';
import { IUserRepo } from '../../../repos/userRepo';
import { GetUserErrors } from './GetUserErrors';

type Response = Either<
    AppError.UnexpectedError | GetUserErrors.UserNotFound,
    Result<UserDto>
>;

@Injectable()
export class GetUserUseCase implements IUseCase<UserDto, Promise<Response>> {
    constructor(@Inject('IUserRepo') public readonly repo: IUserRepo) {}

    async getUserByEachUseCase(user: User): Promise<User> {
        if (user.alias) {
            return this.repo.findByAlias(user.alias);
        }

        if (user.id) {
            return this.repo.findById(user.userId);
        }
        return null;
    }

    async execute(userDto: UserDto): Promise<Response> {
        try {
            const user = UserMap.toDomain(userDto);
            const foundUser = await this.getUserByEachUseCase(user);
            if (foundUser) {
                const resultUserDto = UserMap.fromDomain(foundUser);
                return right(Result.ok(resultUserDto));
            }
            return left(new GetUserErrors.UserNotFound()) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
