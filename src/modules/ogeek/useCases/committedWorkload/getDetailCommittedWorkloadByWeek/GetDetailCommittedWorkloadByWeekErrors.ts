import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetDetailCommittedWorkloadByWeekErrors {
    export class NotFoundCommittedWorkload extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'No CommittedWorkload were found !',
            } as UseCaseError);
        }
    }

    export class NotFoundActualWorklogs extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'No ActualWorklog were found !',
            } as UseCaseError);
        }
    }
}
