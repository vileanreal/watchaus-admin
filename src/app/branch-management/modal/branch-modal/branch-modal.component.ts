import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';
import { BranchDetails } from 'src/app/_shared/models/branch-details';
import { OperationResult } from 'src/app/_shared/models/operation-result';
import { BranchService } from 'src/app/_shared/services/branch.service';

@Component({
    selector: 'app-branch-modal',
    templateUrl: './branch-modal.component.html',
    styleUrls: ['./branch-modal.component.scss'],
})
export class BranchModalComponent implements OnInit {
    action: string = 'Add Branch';
    isProcessing: boolean = false;
    branchDetails: BranchDetails = new BranchDetails();
    formGroup: FormGroup;

    constructor(
        private branchService: BranchService,
        private dialogRef: MatDialogRef<BranchModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: BranchModalData
    ) {
        this.dialogRef.disableClose = true;

        if (data?.action) {
            this.action = data.action;
        }
        if (data?.branchDetails) {
            this.branchDetails = data.branchDetails;
        }
    }

    ngOnInit(): void {
        this.initializeFormGroup();
    }

    initializeFormGroup() {
        // init form group
        this.formGroup = new FormGroup({
            name: new FormControl(this.branchDetails.name, [Validators.required, ValidationHelper.notWhiteSpace]),
        });
    }

    close() {
        if (this.isProcessing) {
            return;
        }
        this.dialogRef.close();
    }

    async save() {
        if (this.isProcessing || !this.isUserDetailsValid()) {
            return;
        }

        let isSuccess: boolean = true;

        if (this.action === 'Add Branch') {
            isSuccess = await this.addBranch();
        } else {
            isSuccess = await this.updateBranch();
        }

        if (!isSuccess) {
            return;
        }

        this.branchService.notifyRecordsHasChanges();
        this.close();
    }

    async addBranch(): Promise<boolean> {
        const data = {
            name: this.formGroup.get('name')?.value,
        };
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.branchService.addBranch(data));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Branch added successfully');
        return true;
    }

    async updateBranch(): Promise<boolean> {
        const data = {
            branchId: this.branchDetails.branchId,
            name: this.formGroup.get('name')?.value,
        };

        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.branchService.updateBranch(data));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Branch updated successfully');
        return true;
    }

    isUserDetailsValid(): boolean {
        let isValid = !this.formGroup.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        }

        this.formGroup.markAllAsTouched();
        return isValid;
    }
}

export interface BranchModalData {
    action: string;
    branchDetails: BranchDetails;
}
