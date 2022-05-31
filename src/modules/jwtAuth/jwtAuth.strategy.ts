import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RoleType } from '../../common/constants/roleType';
import { ConfigService } from '../../shared/services/config.service';

export interface JwtPayload {
    userId: number;
    role: RoleType;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        function extractJwtFromCookie(req: Request): string {
            try {
                return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            } catch (error) {
                throw new UnauthorizedException('Forbidden');
            }
        }

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        if (!payload) {
            throw new UnauthorizedException('Forbidden');
        }
        return payload;
    }
}
