/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetValueStreamError {
    export class FailToGetValueStream extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not find any value stream',
            } as UseCaseError);
        }
    }

    export class NoCommittedWorkloadFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not find any committed workload',
            } as UseCaseError);
        }
    }
}
