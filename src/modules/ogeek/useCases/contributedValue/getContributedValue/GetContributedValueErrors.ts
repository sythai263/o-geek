/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetContributedValueErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, {
                message: `${message} .`,
            } as UseCaseError);
        }
    }
}
