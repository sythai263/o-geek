/* eslint-disable @typescript-eslint/tslint/config */
export interface IUseCase<IRequest, IResponse> {
    execute(request?: IRequest, actor?: number): Promise<IResponse> | IResponse;
}
