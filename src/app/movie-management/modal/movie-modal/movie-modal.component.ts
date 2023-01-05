import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';
import { Genre } from 'src/app/_shared/models/genre';
import { MovieDetails } from 'src/app/_shared/models/movie-details';
import { MovieService } from 'src/app/_shared/services/movie.service';

import * as _moment from 'moment';
const moment = _moment;

@Component({
    selector: 'app-movie-modal',
    templateUrl: './movie-modal.component.html',
    styleUrls: ['./movie-modal.component.scss'],
})
export class MovieModalComponent implements OnInit {
    action: string = 'Add Movie';
    movieDetails: MovieDetails = new MovieDetails();
    isProcessing: boolean = false;

    selectedGenres: any[];

    movieControl: FormGroup;

    constructor(
        private movieService: MovieService,
        private dialogRef: MatDialogRef<MovieModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dialogRef.disableClose = true;
        this.dialogRef.addPanelClass('full-width-dialog');

        if (data && data.action) {
            this.action = data.action;
        }
        if (data?.movieDetais) {
            this.movieDetails = data.movieDetais;
        }
    }

    ngOnInit(): void {
        this.initializeMovieControl();
    }

    initializeMovieControl() {
        this.movieControl = new FormGroup({
            title: new FormControl(this.movieDetails.title, [Validators.required, ValidationHelper.notWhiteSpace]),
            genre: new FormControl(this.selectedGenres, [Validators.required]),
            duration: new FormControl(this.movieDetails.duration, [
                Validators.required,
                ValidationHelper.notWhiteSpace,
                Validators.min(1),
            ]),
            description: new FormControl(this.movieDetails.description, [
                Validators.required,
                ValidationHelper.notWhiteSpace,
            ]),
            showingDateStart: new FormControl('', [Validators.required, Validators.nullValidator]),
            showingDateEnd: new FormControl('', [Validators.required, Validators.nullValidator]),
        });
    }

    get genreList(): Genre[] {
        return this.movieService.genreList;
    }

    close() {
        if (this.isProcessing) {
            return;
        }
        this.dialogRef.close();
    }

    async save() {
        if (this.isProcessing) {
            return;
        }
        if (!this.isMovieDetailsValid()) {
            return;
        }
        let isSuccess: boolean = true;

        // TODO: update code
        // if (this.action == 'Add Movie') {
        //     isSuccess = await this.addUser();
        // } else {
        //     isSuccess = await this.updateUser();
        // }

        if (!isSuccess) {
            return;
        }

        this.movieService.notifyRecordsHasChanges();
        this.close();
    }

    isMovieDetailsValid(): boolean {
        let isValid = !this.movieControl.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        }

        this.movieControl.markAllAsTouched();
        return isValid;
    }
}
