import { Guard } from '../logic/Guard';
import { Result } from '../logic/Result';
import { ValueObject } from './ValueObject';

interface IMemberEmailProps {
    value: string;
}

export class MemberEmail extends ValueObject<IMemberEmailProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props?: IMemberEmailProps) {
        super(props);
    }

    public static create(email?: string): Result<MemberEmail> {
        const guardResult = Guard.combine([
            Guard.againstNullOrUndefined(email, 'email'),
            Guard.isEmail(email, 'email'),
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<MemberEmail>(guardResult.message);
        }
        return Result.ok<MemberEmail>(new MemberEmail({ value: email }));
    }
}
