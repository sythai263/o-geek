import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ConfigService } from '../../shared/services/config.service';
import { JwtAuthService } from '../jwtAuth/jwtAuth.service';
import { UserDto } from '../ogeek/infra/dtos/user.dto';
import { CreateUserUseCase } from '../ogeek/useCases/user/createUser/CreateUserUseCase';
import { GetUserUseCase } from '../ogeek/useCases/user/getUser/GetUserUseCase';
import { OAuthGuard } from './oauth.guard';

@Controller('')
@ApiTags('OAuth')
export class OauthController {
    constructor(
        private _configService: ConfigService,
        private _jwtService: JwtAuthService,
        private _createdUserUseCase: CreateUserUseCase,
        private _getUserUseCase: GetUserUseCase,
    ) {}
    // redirect to authen server
    @Get('api/oauth/otable')
    @UseGuards(OAuthGuard)
    login(): string {
        return '';
    }
    // if user is authenticated, they are redirected here
    @Get('oauth/otable/callback')
    @UseGuards(OAuthGuard)
    async redirectLogin(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const { username } = req.user as { username: string };
        // error from user info server
        if (!username) {
            res.redirect(`${this._configService.get('HOME_URL')}/error`);
        }
        const userDto = { alias: username, ...req.user } as UserDto;

        let result = await this._getUserUseCase.execute(userDto);
        if (result.isLeft()) {
            result = await this._createdUserUseCase.execute(userDto);
        }
        const user = result.value.getValue() as UserDto;
        const jwtToken = this._jwtService.signJwt(user);
        res.redirect(`${this._configService.get(
            'HOME_URL',
        )}/user/callback/?accessToken=${jwtToken}
                    &expireIn=${
                        Date.now() +
                        this._configService.getNumber('JWT_EXPIRATION_TIME')
                    }`);
    }
}
