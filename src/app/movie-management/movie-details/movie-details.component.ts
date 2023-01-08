import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';
import { Genre } from 'src/app/_shared/models/genre';
import { MovieDetails } from 'src/app/_shared/models/movie-details';
import { MovieService } from 'src/app/_shared/services/movie.service';

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.component.html',
    styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
    @Input() movieDetails: MovieDetails;
    @Input() formGroup: FormGroup = new FormGroup({});

    selectedGenres: any[];

    constructor(private movieService: MovieService) {}

    ngOnInit(): void {
        this.initializeFormGroup();
    }

    get genreList(): Genre[] {
        return this.movieService.genreList;
    }

    initializeFormGroup() {
        // init form group

        this.formGroup.addControl(
            'title',
            new FormControl(this.movieDetails.title, [Validators.required, ValidationHelper.notWhiteSpace])
        );
        this.formGroup.addControl('genre', new FormControl(this.movieDetails.genres, [Validators.required]));
        this.formGroup.addControl(
            'duration',
            new FormControl(this.movieDetails.duration, [Validators.required, Validators.min(1)])
        );
        this.formGroup.addControl(
            'description',
            new FormControl(this.movieDetails.description, [Validators.required, ValidationHelper.notWhiteSpace])
        );
        this.formGroup.addControl(
            'showingDateStart',
            new FormControl(this.movieDetails.showingDateStart, [Validators.required, Validators.nullValidator])
        );
        this.formGroup.addControl(
            'showingDateEnd',
            new FormControl(this.movieDetails.showingDateEnd, [Validators.required, Validators.nullValidator])
        );
    }
}
