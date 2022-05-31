import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { HeaderApiKeyStrategy } from './headerApiKeyAuth.strategy';
@Module({
    imports: [PassportModule],
    providers: [HeaderApiKeyStrategy],
})
export class HeaderApiKeyAuthModule {}
