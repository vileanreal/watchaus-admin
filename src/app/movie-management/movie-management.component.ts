import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../_shared/components/dialog/dialog.service';
import { MovieDetails } from '../_shared/models/movie-details';
import { OperationResult } from '../_shared/models/operation-result';
import { MovieService } from '../_shared/services/movie.service';
import { MovieModalComponent } from './modal/movie-modal/movie-modal.component';

@Component({
    selector: 'app-movie-management',
    templateUrl: './movie-management.component.html',
    styleUrls: ['./movie-management.component.scss'],
})
export class MovieManagementComponent implements OnInit {
    isProcessing: boolean = false;

    displayedColumns: string[] = ['title', 'description', 'duration', 'action'];

    dataSource = new MatTableDataSource<MovieDetails>();

    constructor(
        private dialogService: DialogService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private movieService: MovieService
    ) {}

    ngOnInit(): void {
        this.movieService.getGenreList();
        this.getMovieList();
        this.movieService.movieRecordsHasChanges().subscribe({
            next: () => {
                this.getMovieList();
            },
        });
    }

    async getMovieList() {
        this.isProcessing = true;
        let result: OperationResult<MovieDetails[]> = await firstValueFrom(this.movieService.getMovieList());
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }

        this.dataSource = new MatTableDataSource<MovieDetails>(result.data);
    }

    addNewMovie() {
        this.dialog.open(MovieModalComponent);
    }

    updateMovie(movieId: number) {
        // TODO: update movie
    }

    confirmDeleteMovie(movieId: number) {
        this.dialogService.confirmDialog({
            title: 'Delete movie',
            message: 'Are you sure you want to delete this movie?',
            callback: () => {
                this.dialogService.showMessage({
                    title: 'Delete movie',
                    message: 'Movie deleted successfully',
                });
            },
        });
    }
}
