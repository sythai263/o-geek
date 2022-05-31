import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import Axios from 'axios';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as moment from 'moment';
import * as morgan from 'morgan';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-errors.filter';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './viveo-swagger';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        {
            cors: {
                origin: true,
                credentials: true,
            },
        },
    );
    Axios.defaults.timeout = 1000;
    // eslint-disable-next-line import/namespace
    moment.updateLocale('en', {
        week: {
            dow: 6, // Saturday is the first day of the week.
            // doy: 1, // The week that contains Jan 1st is the first week of the year.
        },
    });

    const configService = app.select(SharedModule).get(ConfigService);

    app.use(
        session({
            secret: configService.get('JWT_SECRET_KEY'),
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());

    app.use(compression());
    app.use(morgan('combined'));
    app.use(cookieParser());

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new BadRequestExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
        new AllExceptionsFilter(reflector),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            dismissDefaultMessages: false,
            validationError: {
                target: true,
            },
        }),
    );

    Sentry.init({
        dsn: configService.get('SENTRY_DNS'),
    });

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    // eslint-disable-next-line no-restricted-syntax
    console.info(`server running on port ${port}`);
}

void bootstrap();
