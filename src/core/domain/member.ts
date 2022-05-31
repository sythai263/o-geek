import { Guard } from '../logic/Guard';
import { Result } from '../logic/Result';
import { Entity } from './Entity';
import { MemberEmail } from './memberEmail';
import { MemberId } from './memberId';
import { UniqueEntityID } from './UniqueEntityID';

export interface IMemberProps {
    email?: MemberEmail;
    alias?: string;
}

export class Member extends Entity<IMemberProps> {
    get memberId(): MemberId {
        return MemberId.create(this._id).getValue();
    }

    get email(): MemberEmail {
        return this.props.email;
    }

    get alias(): string {
        return this.props.alias;
    }

    private constructor(id: UniqueEntityID, props?: IMemberProps) {
        super(props, id);
    }

    public static create(
        props?: IMemberProps,
        id?: UniqueEntityID,
    ): Result<Member> {
        const propsResult = Guard.combine([
            Guard.againstNullOrUndefined(props.email, 'email'),
            Guard.againstNullOrUndefined(id, 'memberId'),
        ]);

        if (!propsResult.succeeded) {
            return Result.fail<Member>(propsResult.message);
        }

        const member = new Member(id, props);

        return Result.ok(member);
    }
}
