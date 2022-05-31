import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace CheckNotificationErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor(userId: number) {
            super(false, {
                message: `Could not find User ${userId}.`,
            } as UseCaseError);
        }
    }
    export class NotificationNotFound extends Result<UseCaseError> {
        constructor(notificationId: number) {
            super(false, {
                message: `Could not find Notification ${notificationId}`,
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
