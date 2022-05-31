import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';

interface IValueStreamProps {
    name?: string;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class ValueStream extends AggregateRoot<IValueStreamProps> {
    private constructor(props?: IValueStreamProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get valueStreamId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get name(): string {
        return this.props.name;
    }
    set name(name: string) {
        this.props.name = name;
    }
    public static create(
        props: IValueStreamProps,
        id: UniqueEntityID,
    ): Result<ValueStream> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ValueStream>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const valueStream = new ValueStream(defaultValues, id);
        return Result.ok<ValueStream>(valueStream);
    }
}
