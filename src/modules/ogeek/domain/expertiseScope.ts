import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
interface IExpertiseScopeProps {
    name?: string;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class ExpertiseScope extends AggregateRoot<IExpertiseScopeProps> {
    private constructor(props?: IExpertiseScopeProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get expertiseScopeId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get name(): string {
        return this.props.name;
    }
    set name(name: string) {
        this.props.name = name;
    }
    public static create(
        props: IExpertiseScopeProps,
        id: UniqueEntityID,
    ): Result<ExpertiseScope> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ExpertiseScope>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const expertiseScope = new ExpertiseScope(defaultValues, id);
        return Result.ok<ExpertiseScope>(expertiseScope);
    }
}
