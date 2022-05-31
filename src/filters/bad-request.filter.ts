/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable complexity */
import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import * as _ from 'lodash';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = exception.getStatus();
        const r = <any>exception.getResponse();

        if (_.isArray(r.message) && r.message[0] instanceof ValidationError) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            const validationErrors = <ValidationError[]>r.message;
            this._validationFilter(validationErrors);
        }

        r.statusCode = statusCode;
        r.error = STATUS_CODES[statusCode];

        response.status(statusCode).json(r);
    }

    private _validationFilter(validationErrors: ValidationError[]) {
        for (const validationError of validationErrors) {
            for (const [constraintKey, constraint] of Object.entries(
                validationError.constraints,
            )) {
                if (!constraint) {
                    // convert error message to error.fields.{key} syntax for i18n translation
                    validationError.constraints[constraintKey] =
                        'error.fields.' + _.snakeCase(constraintKey);
                }
            }
            if (!_.isEmpty(validationError.children)) {
                this._validationFilter(validationError.children);
            }
        }
    }
}
