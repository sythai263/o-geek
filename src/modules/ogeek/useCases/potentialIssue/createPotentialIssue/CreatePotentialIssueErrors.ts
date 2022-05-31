import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
export namespace CreatePotentialIssueErrors {
    export class FailToCreatePotentialIssue extends Result<UseCaseError> {
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
