import { Component, OnInit } from '@angular/core';
import { BranchService } from '../_shared/services/branch.service';
import { firstValueFrom } from 'rxjs';
import { BranchDetails } from '../_shared/models/branch-details';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../_shared/components/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { OperationResult } from '../_shared/models/operation-result';
import { BranchModalComponent } from './modal/branch-modal/branch-modal.component';

@Component({
    selector: 'app-branch-management',
    templateUrl: './branch-management.component.html',
    styleUrls: ['./branch-management.component.scss'],
})
export class BranchManagementComponent implements OnInit {
    isProcessing: boolean = false;

    displayedColumns: string[] = ['branch', 'action'];

    dataSource = new MatTableDataSource<BranchDetails>();

    constructor(
        private dialogService: DialogService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private branchService: BranchService
    ) {}

    ngOnInit(): void {
        this.getBranchList();
        this.branchService.branchRecordsHasChanges().subscribe({
            next: () => {
                this.getBranchList();
            },
        });
    }

    async getBranchList() {
        this.isProcessing = true;
        let result: OperationResult<BranchDetails[]> = await firstValueFrom(this.branchService.getBranchList());
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.dataSource = new MatTableDataSource<BranchDetails>(result.data);
    }

    addNewBranch() {
        this.dialog.open(BranchModalComponent);
    }

    async updateBranch(branchDetails: BranchDetails) {
        this.dialog.open(BranchModalComponent, {
            data: {
                action: 'Update Branch',
                branchDetails,
            },
        });
    }

    async proceedToDeleteBranch(branchId: number) {
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.branchService.deleteBranch(branchId));
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }
        this.branchService.notifyRecordsHasChanges();
        this.toastr.success(`Branch successfully deleted!`);
    }

    confirmDeleteBranch(branchId: number) {
        this.dialogService.confirmDialog({
            title: 'Delete branch',
            message: 'Are you sure you want to delete this branch?',
            callback: () => this.proceedToDeleteBranch(branchId),
        });
    }
}
