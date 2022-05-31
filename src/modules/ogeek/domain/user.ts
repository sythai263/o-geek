import { RoleType } from '../../../common/constants/roleType';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';

interface IUserProps {
    alias?: string;
    name?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    role?: RoleType;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class User extends AggregateRoot<IUserProps> {
    private constructor(props: IUserProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get userId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get alias(): string {
        return this.props.alias;
    }
    set alias(alias: string) {
        this.props.alias = alias;
    }
    get name(): string {
        return this.props.name;
    }
    set name(name: string) {
        this.props.name = name;
    }
    get phone(): string {
        return this.props.phone;
    }
    set phone(phone: string) {
        this.props.phone = phone;
    }
    get email(): string {
        return this.props.email;
    }
    set email(email: string) {
        this.props.email = email;
    }
    get avatar(): string {
        return this.props.avatar;
    }
    set avatar(avatar: string) {
        this.props.avatar = avatar;
    }

    get role(): RoleType {
        return this.props.role;
    }
    set role(role: RoleType) {
        this.props.role = role;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
    get deletedAt(): Date {
        return this.props.deletedAt;
    }
    get deletedBy(): number {
        return this.props.deletedBy;
    }
    get createdBy(): number {
        return this.props.createdBy;
    }
    get updatedBy(): number {
        return this.props.updatedBy;
    }
    public isPeopleOps(): boolean {
        return this.props.role === RoleType.PP;
    }
    public static create(props: IUserProps, id?: UniqueEntityID): Result<User> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<User>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        const user = new User(defaultValues, id);
        return Result.ok<User>(user);
    }
}
