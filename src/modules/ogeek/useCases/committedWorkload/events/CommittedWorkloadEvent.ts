import { CommittedWorkload } from '../../../domain/committedWorkload';

export class CommittedWorkloadCreatedEvent {
    committedWorkloads: CommittedWorkload[];
    oldCommittedWorkloads: CommittedWorkload[];
    startDate: Date;

    constructor(
        committedWorkloads: CommittedWorkload[],
        oldCommittedWorkloads: CommittedWorkload[],
        startDate: Date,
    ) {
        this.committedWorkloads = committedWorkloads;
        this.oldCommittedWorkloads = oldCommittedWorkloads;
        this.startDate = startDate;
    }
}
