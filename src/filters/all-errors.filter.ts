/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly _logger = new Logger(AllExceptionsFilter.name);

    constructor(public reflector: Reflector) {}

    catch(exception: HttpException, host: ArgumentsHost): Response {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        this._logger.error(exception);
        const r: any = exception.getResponse ? exception.getResponse() : {};

        r.statusCode = statusCode;
        r.error = STATUS_CODES[statusCode];

        return response.status(statusCode).json(r);
    }
}
