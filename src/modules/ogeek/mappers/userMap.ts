import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';
import { UserEntity } from '../infra/database/entities/user.entity';
import { UserCompactDto } from '../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { UserShortDto } from '../infra/dtos/getUsers/getUsersDto';
import { UserDto } from '../infra/dtos/user.dto';

export class UserMap implements Mapper<User> {
    public static fromDomain(user: User): UserDto {
        const dto = new UserDto();
        if (user) {
            dto.id = new UniqueEntityID(user.userId.id.toValue());
            dto.alias = user.alias;
            dto.email = user.email;
            dto.name = user.name;
            dto.phone = user.phone;
            dto.role = user.role;
            dto.avatar = user.avatar;
        }
        return dto;
    }
    public static fromUserShort(user: User): UserCompactDto {
        if (!user) {
            return new UserCompactDto();
        }
        const id = Number(user.id.toValue());
        return new UserCompactDto(id, user.alias, user.name, user.avatar);
    }

    public static toDomain(raw: UserEntity | UserDto): User {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const userOrError = User.create(
            {
                alias: raw.alias,
                email: raw.email,
                name: raw.name,
                phone: raw.phone,
                role: raw.role,
                avatar: raw.avatar,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            id ? new UniqueEntityID(id.toString()) : new UniqueEntityID(),
        );
        return userOrError.isSuccess ? userOrError.getValue() : null;
    }

    public static toDomainAll(users: UserEntity[]): User[] {
        const userArray = new Array<User>();
        if (users) {
            users.forEach((user) => {
                const userOrError = UserMap.toDomain(user);
                if (userOrError) {
                    userArray.push(userOrError);
                } else {
                    return null;
                }
            });
        }
        return userArray;
    }

    public static fromDomainAll(users: User[]): UserDto[] {
        const arrUserDto = new Array<UserDto>();
        if (users) {
            users.forEach((user) => arrUserDto.push(UserMap.fromDomain(user)));
        }
        return arrUserDto;
    }

    public static toArrayDomain(raws: UserEntity[]): User[] {
        const arrayDomain = Array<User>();
        if (raws) {
            raws.forEach((user) => {
                arrayDomain.push(this.toDomain(user));
            });
        }
        return arrayDomain;
    }

    public static toEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.id = Number(user.id.toString());
        userEntity.alias = user.alias;
        userEntity.phone = user.phone;
        userEntity.email = user.email;
        userEntity.name = user.name;
        userEntity.role = user.role;
        userEntity.createdAt = user.createdAt;
        userEntity.createdBy = user.createdBy;
        userEntity.updatedAt = user.updatedAt;
        userEntity.updatedBy = user.updatedBy;
        userEntity.deletedAt = user.deletedAt;
        userEntity.deletedBy = user.deletedBy;

        return userEntity;
    }

    public static toUserShort(user: User): UserShortDto {
        if (!user) {
            return new UserCompactDto();
        }
        const id = Number(user.id.toValue());
        return new UserShortDto(id, user.alias);
    }

    public static toArrayUserShort(users: User[]): UserShortDto[] {
        const arrayUserShort = new Array<UserShortDto>();
        if (users) {
            users.forEach((user) => {
                arrayUserShort.push(this.toUserShort(user));
            });
        }
        return arrayUserShort;
    }
}
