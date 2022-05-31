/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { DomainId } from '../../../domain/domainId';

export namespace GetOverviewChartDataErrors {
    export class GetOverviewChartDataFailed extends Result<UseCaseError> {
        constructor(userId: DomainId | number) {
            super(false, {
                message: `Failed to get data for overview chart of ${userId.toString()}`,
            } as UseCaseError);
        }
    }
}
