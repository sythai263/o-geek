import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace Successfully {
    export class CreatedSuccess extends Result<UseCaseError> {
        constructor(message: string) {
            super(true, {
                message: `${message} .`,
            } as UseCaseError);
        }
    }
}
