/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as requestContext from 'request-context';

export class ContextService {
    private static readonly _nameSpace = 'request';

    static get<T>(key: string): T {
        return requestContext.get(ContextService._getKeyWithNamespace(key));
    }

    static set(key: string, value: any): void {
        requestContext.set(ContextService._getKeyWithNamespace(key), value);
    }

    private static _getKeyWithNamespace(key: string): string {
        return `${ContextService._nameSpace}.${key}`;
    }
}
