/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
    public uuid(): string {
        return uuid();
    }
    public fileName(ext: string) {
        return this.uuid() + '.' + ext;
    }
}
