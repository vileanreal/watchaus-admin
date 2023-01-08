import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Genre } from '../models/genre';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from '../models/operation-result';
import { MovieDetails } from '../models/movie-details';

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

        const result: OperationResult<Genre[]> = await firstValueFrom(this.http.get(url));

        if (!result.isSuccess) {
            console.error(result.message);
        }

        this.genreList = result.data;
    }

    getMovieDetails(movieId: number) {
        let url = this.config.getApiUrl() + `movie/get-movie-details/${movieId}`;
        return this.http.get(url);
    }

    addMovie(movieDetails: {
        title: string;
        description: string;
        duration: number;
        moviePosterImg: string;
        screenshots: string[];
        showingDateStart: string;
        showingDateEnd: string;
    }) {
        let url = this.config.getApiUrl() + 'movie/add-movie';
        let body = { ...movieDetails };
        return this.http.post(url, body);
    }

    updateMovie(movieDetails: { movieId: number; title: string; description: string; duration: number }) {
        let url = this.config.getApiUrl() + 'movie/update-movie';
        let body = { ...movieDetails };
        return this.http.put(url, body);
    }

    deleteMovie(movieId: number) {
        let url = this.config.getApiUrl() + `movie/delete-movie/${movieId}`;
        let body = {};
        return this.http.delete(url, body);
    }
}
