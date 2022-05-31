import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetPotentialIssuesErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User cannot be found!',
            } as UseCaseError);
        }
    }

    export class GetPotentialIssuesFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to get potential issues!',
            } as UseCaseError);
        }
    }
}
