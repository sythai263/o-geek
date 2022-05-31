import { IssueStatus } from '../../../common/constants/issueStatus';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
import { User } from './user';
interface IIssueProps {
    note: string;
    status: IssueStatus;
    firstDateOfWeek: Date;
    user: User;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class Issue extends AggregateRoot<IIssueProps> {
    private constructor(props?: IIssueProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get issueId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get status(): IssueStatus {
        return this.props.status;
    }
    set status(status: IssueStatus) {
        this.props.status = status;
    }
    get note(): string {
        return this.props.note;
    }
    set note(note: string) {
        this.props.note = note;
    }
    get firstDateOfWeek(): Date {
        return this.props.firstDateOfWeek;
    }
    set firstDateOfWeek(firstDateOfWeek: Date) {
        this.props.firstDateOfWeek = firstDateOfWeek;
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    get createdAt(): Date {
        return this.props.createdAt;
    }
    set createdAt(createdAt: Date) {
        this.props.createdAt = createdAt;
    }
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
    set updatedAt(updatedAt: Date) {
        this.props.updatedAt = updatedAt;
    }
    get deletedAt(): Date {
        return this.props.deletedAt;
    }
    set deletedAt(deletedAt: Date) {
        this.props.deletedAt = deletedAt;
    }
    get createdBy(): number {
        return this.props.createdBy;
    }
    set createdBy(createdBy: number) {
        this.props.createdBy = createdBy;
    }
    get updatedBy(): number {
        return this.props.updatedBy;
    }
    set updatedBy(updatedBy: number) {
        this.props.updatedBy = updatedBy;
    }
    get deletedBy(): number {
        return this.props.deletedBy;
    }
    set deletedBy(deletedBy: number) {
        this.props.deletedBy = deletedBy;
    }
    public static create(
        props: IIssueProps,
        id: UniqueEntityID,
    ): Result<Issue> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<Issue>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const issue = new Issue(defaultValues, id);
        return Result.ok<Issue>(issue);
    }
    public isPotentialIssue(): boolean {
        return this.props.status === IssueStatus.POTENTIAL_ISSUE;
    }
    public markResolvedAndNote(note: string): void {
        this.props.status = IssueStatus.RESOLVED;
        this.props.note = note;
    }
    public updateNote(note: string): void {
        this.props.note = note;
    }
    public static checkStatusResolved(status: IssueStatus): boolean {
        return status === IssueStatus.RESOLVED;
    }
}
