import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { ValueStream } from './valueStream';

interface IContributedValueProps {
    valueStream?: ValueStream;
    expertiseScope?: ExpertiseScope;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class ContributedValue extends AggregateRoot<IContributedValueProps> {
    private constructor(props?: IContributedValueProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get valueStream(): ValueStream {
        return this.props.valueStream;
    }
    set valueStream(valueStream: ValueStream) {
        this.props.valueStream = valueStream;
    }
    get expertiseScope(): ExpertiseScope {
        return this.props.expertiseScope;
    }
    set expertiseScope(expertiseScope: ExpertiseScope) {
        this.props.expertiseScope = expertiseScope;
    }
    get contributedValueId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    public static create(
        props: IContributedValueProps,
        id: UniqueEntityID,
    ): Result<ContributedValue> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ContributedValue>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const contributedValue = new ContributedValue(defaultValues, id);
        return Result.ok<ContributedValue>(contributedValue);
    }
}
