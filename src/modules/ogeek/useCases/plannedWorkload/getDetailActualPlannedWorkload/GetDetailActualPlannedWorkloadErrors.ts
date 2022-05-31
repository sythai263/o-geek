/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetDetailActualPlannedWorkloadAndWorklogError {
    export class GetDetailActualPlannedWorkloadAndWorklogFail extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message:
                    'fail to get detail actual planned workload and worklog by project',
            } as UseCaseError);
        }
    }
}
