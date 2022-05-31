/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetUserErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'The user is not found',
            } as UseCaseError);
        }
    }
}
