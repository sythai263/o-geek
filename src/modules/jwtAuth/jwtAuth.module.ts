import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '../../shared/services/config.service';
import { JwtAuthService } from './jwtAuth.service';
import { JwtAuthStrategy } from './jwtAuth.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtAuthStrategy, JwtAuthService],
    exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
