import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetCommittedWorkloadErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'No committedWorkload were found !',
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden !!! ',
            } as UseCaseError);
        }
    }
}
