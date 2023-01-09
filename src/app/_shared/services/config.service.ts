import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    environment: any;

    constructor(private http: HttpClient) {}

    load() {
        let env = sessionStorage.getItem('environment');
        if (env && env !== '') {
            this.environment = JSON.parse(env);
        } else {
            this.http.get('/assets/env.json').subscribe({
                next: (resp: any) => {
                    this.environment = resp[process.env['NODE_ENV']!];
                    sessionStorage.setItem('environment', JSON.stringify(this.environment));
                },
            });
        }
    }

    getApiUrl(): string {
        return this.environment.apiUrl;
    }
}
