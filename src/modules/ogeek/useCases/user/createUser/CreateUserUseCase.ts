import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { SenteService } from '../../../../../shared/services/sente.service';
import { UserMap } from '../../../../ogeek/mappers/userMap';
import { UserDto } from '../../../infra/dtos/user.dto';
import { UserRepository } from '../../../repos/userRepo';
import { FailToCreateUserErrors } from './CreateUserErrors';

type Response = Either<
    AppError.UnexpectedError | FailToCreateUserErrors.FailToCreateUser,
    Result<UserDto>
>;

@Injectable()
export class CreateUserUseCase implements IUseCase<UserDto, Promise<Response>> {
    constructor(
        @Inject('IUserRepo')
        public readonly repo: UserRepository,

        public readonly senteService: SenteService,
    ) {}

    async execute(userDto: UserDto): Promise<Response> {
        try {
            // check user in Sente
            const request = await this.senteService.getUser(userDto.alias);
            const response = request.data;
            if (!response) {
                return left(
                    new FailToCreateUserErrors.UserNotFound(
                        'User is not found in Sente',
                    ),
                ) as Response;
            }
            const user = UserMap.toDomain(userDto);

            const createdUser = await this.repo.createUser(user);
            if (!createdUser) {
                return left(
                    new FailToCreateUserErrors.FailToCreateUser(),
                ) as Response;
            }
            const result = UserMap.fromDomain(createdUser);
            return right(Result.ok(result));
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
