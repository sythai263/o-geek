/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetOverviewSummaryYearErrors {
    export class FailToGetOverviewSummaryYear extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not get overview summary year',
            } as UseCaseError);
        }
    }
}
