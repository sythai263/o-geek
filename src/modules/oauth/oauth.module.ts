import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthModule } from '../jwtAuth/jwtAuth.module';
import { OGeekModule } from '../ogeek/ogeek.module';
import { OauthController } from './oauth.controller';
import { OAuthStrategy } from './oauth.strategy';

@Module({
    imports: [
        OGeekModule,
        JwtAuthModule,
        TypeOrmModule,
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
    ],
    controllers: [OauthController],
    providers: [OAuthStrategy],
})
export class OauthModule {}
