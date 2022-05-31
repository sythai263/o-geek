/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace FailToCreateUserErrors {
    export class FailToCreateUser extends Result<UseCaseError> {
        constructor(message?: string) {
            super(false, {
                message: message
                    ? message
                    : ' Cannot create new user. Please check your input',
            } as UseCaseError);
        }
    }

    export class UserNotFound extends Result<UseCaseError> {
        constructor(message?: string) {
            super(false, {
                message: message ? message : ' User is not found in Sente',
            } as UseCaseError);
        }
    }
}
