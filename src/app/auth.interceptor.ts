import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './_shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('login')) {
            let token = this.authService.getToken();
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`),
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
