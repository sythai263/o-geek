// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import {
//     CallHandler,
//     ExecutionContext,
//     Injectable,
//     NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';

// import { AuthService } from '../modules/auth/auth.service';
// import { UserEntity } from '../modules/user/user.entity';

// @Injectable()
// export class AuthUserInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//         const request = context.switchToHttp().getRequest();

//         const user = <UserEntity>request.user;
//         AuthService.setAuthUser(user);

//         return next.handle();
//     }
// }
