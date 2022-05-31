import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { RoleType } from '../../../../../common/constants/roleType';
import { UserDto } from '../../dtos/user.dto';
import { CommittedWorkloadEntity } from './committedWorkload.entity';
import { IssueEntity } from './issue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';

@Entity({ name: 'user' })
@Unique('UQ_USER_ALIAS', ['alias'])
@Unique('UQ_USER_PHONE', ['phone'])
@Unique('UQ_USER_EMAIL', ['email'])
export class UserEntity extends AbstractEntity {
    @Column({
        unique: true,
        nullable: false,
        name: 'alias',
        length: 50,
    })
    alias: string;

    @Column({
        nullable: false,
        name: 'name',
        length: 255,
    })
    name: string;

    @Column({
        unique: true,
        nullable: true,
        name: 'phone',
        length: 15,
    })
    phone: string;

    @Column({
        unique: true,
        nullable: false,
        name: 'email',
        length: 255,
    })
    email: string;

    @Column({
        nullable: true,
        name: 'avatar',
        length: 255,
    })
    avatar: string;

    @Column({
        type: 'enum',
        enum: RoleType,
        nullable: false,
        default: RoleType.USER,
    })
    role: RoleType;

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.user,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    @OneToMany(
        () => CommittedWorkloadEntity,
        (committedWorkload) => committedWorkload.user,
    )
    committedWorkloads: CommittedWorkloadEntity[];

    @OneToMany(() => IssueEntity, (issue) => issue.user)
    issue: IssueEntity[];

    toDto(): UserDto {
        return new UserDto(this);
    }

    constructor(
        id?: number,
        alias?: string,
        phone?: string,
        email?: string,
        avatar?: string,
        role?: RoleType,
        name?: string,
        createdBy?: number,
        updatedBy?: number,
        deletedBy?: number,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id);
        this.alias = alias;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.createdBy = createdBy;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
