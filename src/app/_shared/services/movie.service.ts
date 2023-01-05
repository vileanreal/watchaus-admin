import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Genre } from '../models/genre';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from '../models/operation-result';

@Injectable({
    providedIn: 'root',
})
export class MovieService {
    public genreList: Genre[];

    private movieRecordsHasChangesObservable: Observable<boolean>;
    private movieRecordsHasChangeObserver: Observer<boolean>;

    constructor(private http: CustomHttp, private config: ConfigService) {
        this.movieRecordsHasChangesObservable = new Observable((observer) => {
            this.movieRecordsHasChangeObserver = observer;
        });
    }

    movieRecordsHasChanges() {
        return this.movieRecordsHasChangesObservable;
    }

    notifyRecordsHasChanges() {
        this.movieRecordsHasChangeObserver?.next(true);
    }

    getMovieList() {
        let url = this.config.getApiUrl() + 'movie/get-movie-list';
        let body = {};
        return this.http.post(url, body);
    }

    async getGenreList() {
        let url = this.config.getApiUrl() + 'movie/get-genre-list';

        var result: OperationResult<Genre[]> = await firstValueFrom(this.http.get(url));

        if (!result.isSuccess) {
            console.error(result.message);
        }

        this.genreList = result.data;
    }
}
