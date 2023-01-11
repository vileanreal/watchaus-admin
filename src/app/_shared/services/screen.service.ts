import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Genre } from '../models/genre';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from '../models/operation-result';
import { MovieDetails } from '../models/movie-details';
import { ScreenDetails } from '../models/screen-details';

@Injectable({
    providedIn: 'root',
})
export class ScreenService {
    private screenRecordsHasChangesObservable: Observable<boolean>;
    private screenRecordsHasChangeObserver: Observer<boolean>;

    constructor(private http: CustomHttp, private config: ConfigService) {
        this.screenRecordsHasChangesObservable = new Observable((observer) => {
            this.screenRecordsHasChangeObserver = observer;
        });
    }

    screenRecordsHasChanges() {
        return this.screenRecordsHasChangesObservable;
    }

    notifyRecordsHasChanges() {
        this.screenRecordsHasChangeObserver?.next(true);
    }

    assignMovie(screenId: number, movieId: number) {
        let url = this.config.getApiUrl() + `screen/assign-movie-to-screen`;
        let body = { screenId, movieId };
        return this.http.post(url, body);
    }

    getAssignedMovieList(screenId: number) {
        let url = this.config.getApiUrl() + `screen/get-assigned-movie-list/${screenId}`;
        return this.http.get(url);
    }

    getScreenList(branchId: number) {
        let url = this.config.getApiUrl() + `screen/get-screen-list/${branchId}`;
        return this.http.get(url);
    }

    getScreenDetails(screenId: number) {
        let url = this.config.getApiUrl() + `screen/get-screen-details/${screenId}`;
        return this.http.get(url);
    }

    addScreen(data: { branchId: number; screenName: string; noOfSeats: number; charge: number; showTimes: string[] }) {
        let url = this.config.getApiUrl() + `screen/add-screen`;
        let body = { ...data };
        return this.http.post(url, body);
    }

    updateScreen(data: {
        screenId: number;
        branchId: number;
        screenName: string;
        noOfSeats: number;
        charge: number;
        showTimes: string[];
    }) {
        let url = this.config.getApiUrl() + `screen/update-screen`;
        let body = { ...data };
        return this.http.put(url, body);
    }

    deleteScreen(screenId: number) {
        let url = this.config.getApiUrl() + `screen/delete-screen/${screenId}`;
        let body = {};
        return this.http.delete(url, body);
    }

    removeAssignedMovie(screenId: number, movieId: number) {
        let url = this.config.getApiUrl() + `screen/delete-assigned-movie`;
        let body = { screenId, movieId };
        console.log('request body: ', body);
        return this.http.delete(url, body);
    }
}
