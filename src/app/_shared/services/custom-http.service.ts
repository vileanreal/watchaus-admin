import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CustomHttp {
    constructor(private http: HttpClient) {}

    handleError(e: any) {
        console.error(e);
        if (e instanceof HttpErrorResponse) {
            if (
                e &&
                e.error &&
                e.error.hasOwnProperty('isSuccess') &&
                e.error.hasOwnProperty('message') &&
                e.error.hasOwnProperty('data')
            ) {
                return of(e.error);
            }
        }

        let message = e.message;

        if (e.status === 0) {
            message = 'Unable to connect to server.';
        }

        return of({
            isSuccess: false,
            message: message,
            data: null,
        });
    }

    get(url: string) {
        return this.http.get(url).pipe(catchError(this.handleError));
    }

    post(url: string, body: any) {
        return this.http.post(url, body).pipe(catchError(this.handleError));
    }

    delete(url: string, body: any) {
        return this.http.delete(url).pipe(catchError(this.handleError));
    }

    put(url: string, body: any) {
        return this.http.put(url, body).pipe(catchError(this.handleError));
    }
}
