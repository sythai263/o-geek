import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace UpdatePotentialIssueErrors {
    export class FailToUpdatePotentialIssue extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not mark potential issue',
            } as UseCaseError);
        }
    }
    export class UserNotFound extends Result<UseCaseError> {
        constructor(userId: number) {
            super(false, {
                message: `Can not find User ${userId}`,
            } as UseCaseError);
        }
    }
    export class NotFound extends Result<UseCaseError> {
        constructor(potentialIssueId: number) {
            super(false, {
                message: `Can not find potential issue ${potentialIssueId}`,
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden',
            } as UseCaseError);
        }
    }
    export class BadRequest extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Empty input',
            } as UseCaseError);
        }
    }
}
