import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DialogService } from 'src/app/_shared/components/dialog/dialog.service';
import { MovieDetails } from 'src/app/_shared/models/movie-details';
import { OperationResult } from 'src/app/_shared/models/operation-result';
import { MovieService } from 'src/app/_shared/services/movie.service';
import { ScreenService } from 'src/app/_shared/services/screen.service';

@Component({
    selector: 'app-assigned-movie-modal',
    templateUrl: './assigned-movie-modal.component.html',
    styleUrls: ['./assigned-movie-modal.component.scss'],
})
export class AssignedMovieModalComponent implements OnInit {
    screenId: number;
    selectedMovie: number = 0;
    isProcessing: boolean = false;
    movieList: MovieDetails[] = [];

    displayedColumns: string[] = ['title', 'action'];
    dataSource = new MatTableDataSource<MovieDetails>();

    constructor(
        private dialogService: DialogService,
        private screenService: ScreenService,
        private movieService: MovieService,
        private dialogRef: MatDialogRef<AssignedMovieModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: AssignedMovieModalData
    ) {
        this.dialogRef.disableClose = true;

        if (data?.screenId) {
            this.screenId = data.screenId;
        }
    }

    ngOnInit(): void {
        this.getMovieList();
        this.getAssignedMovieList();
    }

    get movieListFiltered(): MovieDetails[] {
        return this.movieList.filter((x) => !this.dataSource.data.find((y) => y.movieId === x.movieId));
    }

    async assignMovie() {
        if (!this.selectedMovie || this.selectedMovie === 0) {
            this.toastr.warning('Select a movie first');
            return;
        }

        this.isProcessing = true;
        let result: OperationResult<MovieDetails[]> = await firstValueFrom(
            this.screenService.assignMovie(this.screenId, this.selectedMovie)
        );
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.selectedMovie = 0;
        this.getAssignedMovieList();
    }

    async getAssignedMovieList() {
        this.isProcessing = true;
        let result: OperationResult<MovieDetails[]> = await firstValueFrom(
            this.screenService.getAssignedMovieList(this.screenId)
        );
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.dataSource = new MatTableDataSource<MovieDetails>(result.data);
    }

    async getMovieList() {
        const apiResult: OperationResult<MovieDetails[]> = await firstValueFrom(this.movieService.getMovieList());
        if (!apiResult.isSuccess) {
            this.toastr.error('Unable to get move list');
            return;
        }
        this.movieList = apiResult.data;
    }

    close() {
        this.dialogRef.close();
    }

    async proceedToRemoveMovie(movieId: number) {
        this.isProcessing = true;
        let result: OperationResult<MovieDetails[]> = await firstValueFrom(
            this.screenService.removeAssignedMovie(this.screenId, movieId)
        );
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.selectedMovie = 0;
        this.getAssignedMovieList();
    }

    confirmRemove(movieId: number) {
        this.dialogService.confirmDialog({
            title: 'Remove move',
            message: 'Are you sure you want to remove this movie from screen?',
            callback: () => this.proceedToRemoveMovie(movieId),
        });
    }
}

export interface AssignedMovieModalData {
    screenId: number;
}
