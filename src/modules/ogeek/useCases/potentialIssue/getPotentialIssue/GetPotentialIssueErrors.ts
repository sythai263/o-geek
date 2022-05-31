import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetPotentialIssueErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not get potential issue',
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
}
