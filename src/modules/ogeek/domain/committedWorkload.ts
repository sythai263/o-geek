import * as moment from 'moment';

import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { CommittingWorkloadStatus } from '../../../common/constants/committingStatus';
import { dateRange } from '../../../common/constants/dateRange';
import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { SYSTEM } from '../../../common/constants/system';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ContributedValue } from './contributedValue';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { PlannedWorkload } from './plannedWorkload';
import { User } from './user';
import { ValueStream } from './valueStream';

interface ICommittedWorkloadProps {
    contributedValue?: ContributedValue;
    user?: User;
    committedWorkload?: number;
    sumCommittedWorkload?: number;
    sumPlannedWorkload?: number;
    status?: CommittedWorkloadStatus;
    statusCommitting?: CommittingWorkloadStatus;
    startDate?: Date;
    expiredDate?: Date;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class CommittedWorkload extends AggregateRoot<ICommittedWorkloadProps> {
    private constructor(props?: ICommittedWorkloadProps, id?: UniqueEntityID) {
        super(props, id);
    }
    get committedWorkloadId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get contributedValue(): ContributedValue {
        return this.props.contributedValue;
    }
    set contributedValue(contributedValue: ContributedValue) {
        this.props.contributedValue = contributedValue;
    }
    get expertiseScope(): ExpertiseScope {
        return this.props.contributedValue.expertiseScope;
    }
    get valueStream(): ValueStream {
        return this.props.contributedValue.valueStream;
    }
    get createdBy(): number {
        return this.props.createdBy;
    }
    set createdBy(createdBy: number) {
        this.props.createdBy = createdBy;
    }
    get updatedBy(): number {
        return this.props.createdBy;
    }
    set updatedBy(updatedBy: number) {
        this.props.updatedBy = updatedBy;
    }
    get deletedBy(): number {
        return this.props.createdBy;
    }
    set deletedBy(deletedBy: number) {
        this.props.deletedBy = deletedBy;
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    get committedWorkload(): number {
        return this.props.committedWorkload;
    }
    set committedWorkload(workload: number) {
        this.props.committedWorkload = workload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    set startDate(startDate: Date) {
        this.props.startDate = startDate;
    }
    get expiredDate(): Date {
        return this.props.expiredDate;
    }
    set expiredDate(expiredDate: Date) {
        this.props.expiredDate = expiredDate;
    }
    get status(): CommittedWorkloadStatus {
        return this.props.status;
    }
    set status(status: CommittedWorkloadStatus) {
        this.props.status = status;
    }
    get sumCommittedWorkload(): number {
        return this.props.sumCommittedWorkload;
    }
    set sumCommittedWorkload(sum: number) {
        this.props.sumCommittedWorkload = sum;
    }
    get sumPlannedWorkload(): number {
        return this.props.sumPlannedWorkload;
    }
    set sumPlannedWorkload(sum: number) {
        this.props.sumPlannedWorkload = sum;
    }
    get createdAt(): Date {
        return this.props.createdAt;
    }
    set createdAt(createdAt: Date) {
        this.props.createdAt = createdAt;
    }
    get updatedAt(): Date {
        return this.props.createdAt;
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
    get statusCommitting(): CommittingWorkloadStatus {
        return this.props.statusCommitting;
    }
    set statusCommitting(status: CommittingWorkloadStatus) {
        this.props.statusCommitting = status;
    }
    public isActive(): boolean {
        return this.props.status === CommittedWorkloadStatus.ACTIVE;
    }
    public isComing(): boolean {
        return this.status === CommittedWorkloadStatus.INCOMING;
    }
    public getValueStreamId(): number {
        return Number(this.contributedValue.valueStream.id);
    }
    public getExpertiseScopeId(): number {
        return Number(this.contributedValue.expertiseScope.id);
    }
    public getExpertiseScopeName(): string {
        return this.contributedValue.expertiseScope.name;
    }

    public belongToExpertiseScope(expertiseScopeId: number | string): boolean {
        return (
            this.contributedValue.expertiseScope.id.toValue() ===
            expertiseScopeId
        );
    }

    public durationDay(startDate: Date, endDate: Date): number {
        if (startDate < endDate) {
            return Math.floor(
                (endDate.getTime() - startDate.getTime()) /
                    (dateRange.MILLISECONDS_IN_DAY * dateRange.DAY_OF_WEEK),
            );
        }
        return Math.floor(
            (startDate.getTime() - endDate.getTime()) /
                (dateRange.MILLISECONDS_IN_DAY * dateRange.DAY_OF_WEEK),
        );
    }
    // startDate < startDateOfYear
    public calculateExpiredDateOne(
        startDateOfYear: Date,
        endDateOfYear: Date,
        expiredDate: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return (
                this.durationDay(startDateOfYear, expiredDate) *
                this.committedWorkload
            );
        }
        return (
            this.durationDay(startDateOfYear, endDateOfYear) *
            this.committedWorkload
        );
    }
    // startDate >= startDateOfYear
    public calculateExpiredDateTwo(
        startDate: Date,
        expiredDate: Date,
        endDateOfYear: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return (
                this.durationDay(startDate, expiredDate) *
                this.committedWorkload
            );
        }
        // epxiredDate > endDateOfYear
        if (expiredDate > endDateOfYear) {
            return (
                this.durationDay(startDate, endDateOfYear) *
                this.committedWorkload
            );
        }
    }
    public calculate(
        startDateOfYearString: string,
        endDateOfYearString: string,
    ): number {
        const startDateOfYear = new Date(startDateOfYearString);
        const endDateOfYear = new Date(endDateOfYearString);
        if (this.startDate < startDateOfYear) {
            this.sumCommittedWorkload = this.calculateExpiredDateOne(
                startDateOfYear,
                endDateOfYear,
                this.expiredDate,
            );
            return this.sumCommittedWorkload;
        }
        // startDate >= startDateOfYear
        this.sumCommittedWorkload = this.calculateExpiredDateTwo(
            this.startDate,
            this.expiredDate,
            endDateOfYear,
        );
        return this.sumCommittedWorkload;
    }
    public changeStatus(status: CommittedWorkloadStatus): void {
        this.props.status = status;
    }

    public handleExpiredDateOldCommittedWorkload(startDate: Date): void {
        if (this.expiredDate > startDate) {
            this.expiredDate = startDate;
        }
    }

    public checkExpiredDateWhenUpdate(expiredDate: Date): boolean {
        return this.expiredDate < expiredDate;
    }

    public autoGeneratePlanned(): PlannedWorkload[] {
        let startDate = moment(this.startDate);

        const expiredDate = moment(this.expiredDate);
        const plannedAutoGen = new Array<PlannedWorkload>();
        if (startDate.weekday() !== 0) {
            startDate = startDate.add(-startDate.weekday(), 'd');
        }

        for (
            let i = startDate;
            i <= expiredDate;
            i.add(dateRange.DAY_OF_WEEK, 'd')
        ) {
            const reason = `Auto generate planned workload by committed workload ${this._id.toValue()} week ${i.weeks()} year ${i.year()} `;
            const planned = PlannedWorkload.create({
                reason,
                startDate: startDate.toDate(),
                committedWorkload: this,
                contributedValue: this.contributedValue,
                plannedWorkload: this.committedWorkload,
                user: this.user,
                status: PlannedWorkloadStatus.PLANNING,
                createdBy: SYSTEM,
                updatedBy: SYSTEM,
            });
            plannedAutoGen.push(planned.getValue());
        }
        return plannedAutoGen;
    }

    public autoArchivePlannedWorkload(
        startDate: Date,
        plannedWorkloads: PlannedWorkload[],
    ): PlannedWorkload[] {
        for (const plan of plannedWorkloads) {
            plan.setArchivePlannedWorkload(startDate);
        }
        return plannedWorkloads;
    }
    public static create(
        props: ICommittedWorkloadProps,
        id?: UniqueEntityID,
    ): Result<CommittedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<CommittedWorkload>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.contributedValue = props.contributedValue;
        if (!defaultValues.createdBy) {
            defaultValues.createdBy = SYSTEM;
        }
        if (!defaultValues.updatedBy) {
            defaultValues.updatedBy = SYSTEM;
        }
        const committedWorkload = new CommittedWorkload(defaultValues, id);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }

    public static changeStatusActiveAndIncoming(
        committingWorkloads: CommittedWorkload[],
    ): CommittedWorkload[] {
        return committingWorkloads.map((committingWorkload) => {
            if (committingWorkload.isActive()) {
                committingWorkload.changeStatus(
                    CommittedWorkloadStatus.NOT_RENEW,
                );
            }
            if (committingWorkload.isComing()) {
                committingWorkload.changeStatus(
                    CommittedWorkloadStatus.INACTIVE,
                );
            }
            return committingWorkload;
        });
    }
}
