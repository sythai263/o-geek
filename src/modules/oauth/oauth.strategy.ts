import { HttpService, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AxiosRequestConfig } from 'axios';
import { Strategy } from 'passport-oauth2';
import { map } from 'rxjs/operators';

import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../ogeek/infra/dtos/user.dto';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _httpService: HttpService,
    ) {
        super({
            authorizationURL: _configService.get('AUTHORIZATION_URL'),
            tokenURL: _configService.get('TOKEN_URL'),
            clientID: _configService.get('CLIENT_ID'),
            clientSecret: _configService.get('CLIENT_SECRET'),
            callbackURL: _configService.get('CALLBACK_URL'),
            state: true,
        });
    }

    async validate(accessToken: string): Promise<UserDto> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        return this._httpService
            .get<UserDto>(this._configService.get('USERINFO_URL'), axiosConfig)
            .pipe(map((resp) => resp.data))
            .toPromise();
    }
}
