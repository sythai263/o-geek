import * as moment from 'moment';

import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { MomentService } from '../../../providers/moment.service';
import { CommittedWorkload } from './committedWorkload';
import { ContributedValue } from './contributedValue';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { User } from './user';
import { ValueStream } from './valueStream';

interface IPlannedWorkloadProps {
    contributedValue?: ContributedValue;
    user?: User;
    plannedWorkload?: number;
    sumPlannedWorkload?: number;
    committedWorkload?: CommittedWorkload;
    startDate?: Date;
    reason?: string;
    status?: PlannedWorkloadStatus;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    private constructor(props?: IPlannedWorkloadProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    get plannedWorkload(): number {
        return this.props.plannedWorkload;
    }
    set plannedWorkload(workload: number) {
        this.props.plannedWorkload = workload;
    }
    get sumPlannedWorkload(): number {
        return this.props.sumPlannedWorkload;
    }
    set sumPlannedWorkload(sum: number) {
        this.props.sumPlannedWorkload = sum;
    }
    get committedWorkload(): CommittedWorkload {
        return this.props.committedWorkload;
    }
    set committedWorkload(committedWorkload: CommittedWorkload) {
        this.props.committedWorkload = committedWorkload;
    }
    set reason(reason: string) {
        this.props.reason = reason;
    }
    get reason(): string {
        return this.props.reason;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    set startDate(startDate: Date) {
        this.props.startDate = startDate;
    }
    get status(): PlannedWorkloadStatus {
        return this.props.status;
    }
    set status(status: PlannedWorkloadStatus) {
        this.props.status = status;
    }
    get valueStream(): ValueStream {
        return this.props.contributedValue.valueStream;
    }
    get expertiseScope(): ExpertiseScope {
        return this.props.contributedValue.expertiseScope;
    }
    get plannedWorkloadId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get contributedValue(): ContributedValue {
        return this.props.contributedValue;
    }
    get isClosed(): boolean {
        return this.props.status === PlannedWorkloadStatus.CLOSED;
    }
    get isPlanning(): boolean {
        return this.props.status === PlannedWorkloadStatus.PLANNING;
    }
    get isActive(): boolean {
        return this.props.status !== PlannedWorkloadStatus.ARCHIVE;
    }
    get isExecuting(): boolean {
        return this.props.status === PlannedWorkloadStatus.EXECUTING;
    }
    get isExecutingOrClosed(): boolean {
        return this.isActive && !this.isPlanning;
    }
    get isCreatedByUser(): boolean {
        return this.props.createdBy > 0;
    }

    isClosedInCurrentWeek(): boolean {
        const currentWeek = MomentService.getCurrentWeek();
        return this.props.startDate >=
            MomentService.firstDateOfWeek(currentWeek) &&
            this.props.startDate <= MomentService.lastDateOfWeek(currentWeek) &&
            this.props.status === PlannedWorkloadStatus.CLOSED
            ? true
            : false;
    }

    get notReviewRetroAtTheEndOfTheWeek(): boolean {
        return (
            this.props.status === PlannedWorkloadStatus.EXECUTING &&
            moment(this.props.startDate).week() < moment().week()
        );
    }
    isBetweenWeek(week: number): boolean {
        const startDateOfWeek = new Date(MomentService.firstDateOfWeek(week));
        const endDateOfWeek = new Date(MomentService.lastDateOfWeek(week));
        if (
            this.props.startDate >= startDateOfWeek &&
            this.props.startDate <= endDateOfWeek
        ) {
            return true;
        }
        return false;
    }

    isBelongToCommit(committedWlId: number | string): boolean {
        return this.committedWorkload.id.toValue() === committedWlId;
    }

    isBelongToExpScope(expScopeId: number | string): boolean {
        return this.contributedValue.expertiseScope.id.toValue() === expScopeId;
    }

    plusPlanWorkload(planWorkload: number): void {
        this.props.plannedWorkload += planWorkload;
    }

    public static calculate(
        plannedWorkloads: PlannedWorkload[],
        committedWorkloadItem: CommittedWorkload,
    ): number {
        return plannedWorkloads.reduce(
            (preTotalPlannedWorkload, currentPlannedWorkload) =>
                preTotalPlannedWorkload +
                (currentPlannedWorkload.committedWorkload.id.toValue() ===
                committedWorkloadItem.id.toValue()
                    ? currentPlannedWorkload.plannedWorkload
                    : 0),
            0,
        );
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
    public closeWeek(userId: number): void {
        if (this.status !== PlannedWorkloadStatus.EXECUTING) {
            return;
        }
        this.status = PlannedWorkloadStatus.CLOSED;
        this.props.updatedBy = userId;
    }
    public startWeek(userId: number): void {
        if (this.status !== PlannedWorkloadStatus.PLANNING) {
            return;
        }
        this.status = PlannedWorkloadStatus.EXECUTING;
        this.updatedBy = userId;
    }
    public deActivate(userId: number): void {
        if (this.status === PlannedWorkloadStatus.ARCHIVE) {
            return;
        }
        this.status = PlannedWorkloadStatus.ARCHIVE;
        this.updatedBy = userId;
    }
    public setArchivePlannedWorkload(startDate: Date): void {
        if (
            this.startDate > startDate &&
            this.status === PlannedWorkloadStatus.PLANNING
        ) {
            this.status = PlannedWorkloadStatus.ARCHIVE;
            this.reason = `Auto update old planned workload after add committed ${this.committedWorkload.id.toValue()} `;
        }
    }
    public static create(
        props: IPlannedWorkloadProps,
        id?: UniqueEntityID,
    ): Result<PlannedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<PlannedWorkload>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };

        const plannedWorkload = new PlannedWorkload(defaultValues, id);
        return Result.ok<PlannedWorkload>(plannedWorkload);
    }
}
