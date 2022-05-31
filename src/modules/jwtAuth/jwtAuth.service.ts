import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDto } from '../ogeek/infra/dtos/user.dto';
import { JwtPayload } from './jwtAuth.strategy';
@Injectable()
export class JwtAuthService {
    constructor(private _jwtService: JwtService) {}

    signJwt(user: UserDto): string {
        const payload = {
            userId: user.id.toValue(),
            role: user.role,
        } as JwtPayload;
        return this._jwtService.sign(payload);
    }
}
