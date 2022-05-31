/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/tslint/config */
import * as express from 'express';

export abstract class BaseController {
    // or even private
    protected req: express.Request;
    protected res: express.Response;

    protected abstract executeImpl(): Promise<void | any>;

    public execute(req: express.Request, res: express.Response): void {
        this.req = req;
        this.res = res;

        void this.executeImpl();
    }

    public static jsonResponse({
        res,
        code,
        message,
    }: {
        res: express.Response;
        code: number;
        message: string;
    }) {
        return res.status(code).json({ message });
    }

    public ok<T>(res: express.Response, dto?: T) {
        if (dto) {
            return res.status(200).json(dto);
        }
        return res.sendStatus(200);
    }

    public created(res: express.Response) {
        return res.sendStatus(201);
    }

    public clientError(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 400,
            message: message ? message : 'Unauthorized',
        });
    }

    public unauthorized(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 401,
            message: message ? message : 'Unauthorized',
        });
    }

    public paymentRequired(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 402,
            message: message ? message : 'Payment required',
        });
    }

    public forbidden(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 403,
            message: message ? message : 'Forbidden',
        });
    }

    public notFound(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 404,
            message: message ? message : 'Not found',
        });
    }

    public conflict(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 409,
            message: message ? message : 'Conflict',
        });
    }

    public tooMany(message?: string) {
        return BaseController.jsonResponse({
            res: this.res,
            code: 429,
            message: message ? message : 'Too many requests',
        });
    }

    public todo() {
        return BaseController.jsonResponse({
            res: this.res,
            code: 400,
            message: 'TODO',
        });
    }

    public fail(error: Error | string) {
        return this.res.status(500).json({
            message: error.toString(),
        });
    }
}
