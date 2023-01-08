import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';
import { Genre } from 'src/app/_shared/models/genre';
import { MovieDetails } from 'src/app/_shared/models/movie-details';
import { MovieService } from 'src/app/_shared/services/movie.service';

import * as _moment from 'moment';
import { MoveImgData, MovieScreenshotsComponent } from '../../movie-screenshots/movie-screenshots.component';
import { OperationResult } from 'src/app/_shared/models/operation-result';
import { firstValueFrom } from 'rxjs';
const moment = _moment;

@Component({
    selector: 'app-movie-modal',
    templateUrl: './movie-modal.component.html',
    styleUrls: ['./movie-modal.component.scss'],
})
export class MovieModalComponent implements OnInit {
    @ViewChild(MovieScreenshotsComponent) imgComponent!: MovieScreenshotsComponent;

    action: string = 'Add Movie';
    movieDetails: MovieDetails = new MovieDetails();
    isProcessing: boolean = false;

    selectedGenres: any[];

    formGroup: FormGroup = new FormGroup({});

    movieImages: MoveImgData;

    constructor(
        private movieService: MovieService,
        private dialogRef: MatDialogRef<MovieModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            action: string;
            movieDetails: MovieDetails;
        }
    ) {
        this.dialogRef.disableClose = true;
        this.dialogRef.addPanelClass('dialog-1000');

        if (data && data.action) {
            this.action = data.action;
        }
        if (data?.movieDetails) {
            this.movieDetails = data.movieDetails;
            this.movieImages = {
                posterBase64: data.movieDetails.moviePosterImg,
                screenshotsBase64: data.movieDetails.screenshots,
            };
        }
    }

    ngOnInit(): void {}

    close() {
        if (this.isProcessing) {
            return;
        }
        this.dialogRef.close();
    }

    async save() {
        if (this.isProcessing || !this.isMovieDetailsValid()) {
            return;
        }

        let isSuccess: boolean = true;

        if (this.action === 'Add Movie') {
            isSuccess = await this.addMovie();
        } else {
            isSuccess = await this.updateMovie();
        }

        if (!isSuccess) {
            return;
        }

        this.movieService.notifyRecordsHasChanges();
        this.close();
    }

    async addMovie(): Promise<boolean> {
        this.isProcessing = true;
        const data = {
            title: this.formGroup.get('title')?.value,
            description: this.formGroup.get('description')?.value,
            duration: this.formGroup.get('duration')?.value,
            genres: this.formGroup.get('genre')?.value,
            showingDateStart: this.formGroup.get('showingDateStart')?.value.format('YYYY-MM-DD'),
            showingDateEnd: this.formGroup.get('showingDateEnd')?.value.format('YYYY-MM-DD'),
            moviePosterImg: this.movieImages.posterBase64,
            screenshots: this.movieImages.screenshotsBase64,
        };
        let result: OperationResult<any> = await firstValueFrom(this.movieService.addMovie(data));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Movie added successfully');
        return true;
    }

    async updateMovie(): Promise<boolean> {
        this.isProcessing = true;

        const data = {
            movieId: this.movieDetails.movieId,
            title: this.formGroup.get('title')?.value,
            description: this.formGroup.get('description')?.value,
            duration: this.formGroup.get('duration')?.value,
            genres: this.formGroup.get('genre')?.value,
        };
        let result: OperationResult<any> = await firstValueFrom(this.movieService.updateMovie(data));

        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Movie updated successfully');
        return true;
    }

    isMovieDetailsValid(): boolean {
        let isValid = !this.formGroup.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        } else if (!this.movieImages || !this.movieImages.posterBase64 || this.movieImages.posterBase64 === '') {
            isValid = false;
            this.toastr.warning('Please select a movie poster');
        } else if (
            !this.movieImages ||
            !this.movieImages.screenshotsBase64 ||
            this.movieImages.screenshotsBase64.length === 0
        ) {
            isValid = false;
            this.toastr.warning('Please select a screenshots');
        }

        this.formGroup.markAllAsTouched();
        return isValid;
    }

    onSelectImages(imgs: MoveImgData) {
        this.movieImages = imgs;
    }
}
