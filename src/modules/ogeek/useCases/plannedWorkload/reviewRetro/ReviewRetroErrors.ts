import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace ReviewRetroErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User cannot be found!',
            } as UseCaseError);
        }
    }
    export class NotStartWeek extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Cannot review retro without starting week!',
            } as UseCaseError);
        }
    }
}
