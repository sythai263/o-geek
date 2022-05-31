/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable complexity */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { SenteService } from '../shared/services/sente.service';

@Injectable()
export class SenteAuthGuard implements CanActivate {
    constructor(public readonly senteService: SenteService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const result = await this.senteService.getUserProfileFromCookie(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            request?.headers?.authorization,
        );

        if (result.isSuccess) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            request.user = result.getValue();
        }

        return result.isSuccess;
    }
}
