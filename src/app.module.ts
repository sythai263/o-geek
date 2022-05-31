import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { HeaderApiKeyAuthModule } from './modules/headerApiKeyAuth/headerApiKeyAuth.module';
import { JwtAuthModule } from './modules/jwtAuth/jwtAuth.module';
import { OauthModule } from './modules/oauth/oauth.module';
import { OGeekModule } from './modules/ogeek/ogeek.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        JwtAuthModule,
        OGeekModule,
        OauthModule,
        HeaderApiKeyAuthModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
    ],
    providers: [],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
