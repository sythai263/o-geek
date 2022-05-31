/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetUserErrors {
    export class NoUsers extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'No users were found!!',
            } as UseCaseError);
        }
    }
}
