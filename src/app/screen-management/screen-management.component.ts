import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../_shared/components/dialog/dialog.service';
import { BranchDetails } from '../_shared/models/branch-details';
import { OperationResult } from '../_shared/models/operation-result';
import { ScreenDetails } from '../_shared/models/screen-details';
import { BranchService } from '../_shared/services/branch.service';
import { ScreenService } from '../_shared/services/screen.service';
import {
    AssignedMovieModalComponent,
    AssignedMovieModalData,
} from './modal/assigned-movie-modal/assigned-movie-modal.component';
import { ScreenModalComponent, ScreenModalData } from './modal/screen-modal/screen-modal.component';

@Component({
    selector: 'app-screen-management',
    templateUrl: './screen-management.component.html',
    styleUrls: ['./screen-management.component.scss'],
})
export class ScreenManagementComponent implements OnInit {
    isProcessing: boolean = false;
    branchList: BranchDetails[];
    selectedBranchId: number = 1;

    displayedColumns: string[] = ['screenName', 'noOfSeats', 'charge', 'action'];

    dataSource = new MatTableDataSource<ScreenDetails>();

    constructor(
        private dialogService: DialogService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private branchService: BranchService,
        private screenService: ScreenService
    ) {}

    ngOnInit(): void {
        this.getBranchList();
        this.getScreenList();
        this.screenService.screenRecordsHasChanges().subscribe({
            next: () => {
                this.getScreenList();
            },
        });
    }

    async getScreenList() {
        this.isProcessing = true;
        let result: OperationResult<ScreenDetails[]> = await firstValueFrom(
            this.screenService.getScreenList(this.selectedBranchId)
        );
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.dataSource = new MatTableDataSource<ScreenDetails>(result.data);
    }

    async getBranchList() {
        this.isProcessing = true;
        let apiResult: OperationResult<BranchDetails[]> = await firstValueFrom(this.branchService.getBranchList());
        this.isProcessing = false;
        if (!apiResult.isSuccess) {
            this.toastr.error(apiResult.message);
            return;
        }
        this.branchList = apiResult.data;
    }

    manageAssignedMovies(screenId: number) {
        const data: AssignedMovieModalData = { screenId };
        this.dialog.open(AssignedMovieModalComponent, { data });
    }

    addNewScreen() {
        if (!this.selectedBranchId || this.selectedBranchId === 0) {
            this.toastr.warning('Select a branch first');
            return;
        }

        const screenModalData: ScreenModalData = {
            action: 'Add Screen',
            branchId: this.selectedBranchId,
        };

        this.dialog.open(ScreenModalComponent, { data: screenModalData });
    }

    async updateScreen(screenId: number) {
        this.isProcessing = true;
        let apiResult: OperationResult<ScreenDetails> = await firstValueFrom(
            this.screenService.getScreenDetails(screenId)
        );
        this.isProcessing = false;

        if (!apiResult.isSuccess) {
            this.toastr.error(apiResult.message);
            return;
        }
        const data = apiResult.data;

        const screenDetails: ScreenDetails = {
            screenId: data.screenId,
            branchId: data.branchId,
            screenName: data.screenName,
            noOfSeats: data.noOfSeats,
            charge: data.charge,
            showTimes: data.showTimes,
        };

        const screenModalData: ScreenModalData = {
            action: 'Update Screen',
            branchId: this.selectedBranchId,
            screenDetails: screenDetails,
        };

        this.dialog.open(ScreenModalComponent, {
            data: screenModalData,
        });
    }

    async proceedToDeleteScreen(screenId: number) {
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.screenService.deleteScreen(screenId));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }

        this.screenService.notifyRecordsHasChanges();
        this.toastr.success(`Screen successfully deleted!`);
    }

    confirmDeleteScreen(screenId: number) {
        this.dialogService.confirmDialog({
            title: 'Delete screen',
            message: 'Are you sure you want to delete this screen?',
            callback: () => this.proceedToDeleteScreen(screenId),
        });
    }
}
