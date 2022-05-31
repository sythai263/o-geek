import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace PlanWorkloadErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User cannot be found!',
            } as UseCaseError);
        }
    }
    export class PlanWorkloadFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to plan workload!',
            } as UseCaseError);
        }
    }
    export class InputValidationFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to validate input!',
            } as UseCaseError);
        }
    }
    export class NotCommitYet extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User does not commit for this contributed value yet!',
            } as UseCaseError);
        }
    }
    export class NonExistentContributedValue extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Contributed value does not exist!',
            } as UseCaseError);
        }
    }
}
