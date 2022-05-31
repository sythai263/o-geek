import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetNotificationErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor(userId: number) {
            super(false, {
                message: `Could not find User ${userId}.`,
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden.',
            } as UseCaseError);
        }
    }
}
