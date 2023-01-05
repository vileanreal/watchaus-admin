import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggonedUserDetails } from '../models/loggoned-user-details';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _loginUrl = 'https://localhost:7050/api/auth/login';

    constructor(
        private http: CustomHttp,
        private _router: Router,
        private config: ConfigService
    ) {}

    loginUser(username: string, password: string) {
        let url = this.config.getApiUrl() + 'auth/login';
        let body = {
            username,
            password,
        };
        return this.http.post(url, body);
    }

    get isLoggedIn() {
        return !!sessionStorage.getItem('token');
    }

    get userDetails(): LoggonedUserDetails {
        return JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    }

    getToken() {
        return sessionStorage.getItem('token');
    }

    logoutUser() {
        sessionStorage.removeItem('token');
        this._router.navigate(['/']);
    }
}
