import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetPlannedWorkloadHistoryErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User cannot be found!',
            } as UseCaseError);
        }
    }
    export class GetPlannedWorkloadHistoryFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to get planned workload history!',
            } as UseCaseError);
        }
    }
}
