import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetWarningMessagesErrors {
    export class LastWeekNotClosed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Last week is not closed!',
            } as UseCaseError);
        }
    }
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User cannot be found!',
            } as UseCaseError);
        }
    }
    export class GetMessagesFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to get warning messages!',
            } as UseCaseError);
        }
    }
}
