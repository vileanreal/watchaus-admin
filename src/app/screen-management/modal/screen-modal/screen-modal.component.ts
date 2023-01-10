import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DialogService } from 'src/app/_shared/components/dialog/dialog.service';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';
import { OperationResult } from 'src/app/_shared/models/operation-result';
import { ScreenDetails } from 'src/app/_shared/models/screen-details';
import { ScreenService } from 'src/app/_shared/services/screen.service';

@Component({
    selector: 'app-screen-modal',
    templateUrl: './screen-modal.component.html',
    styleUrls: ['./screen-modal.component.scss'],
})
export class ScreenModalComponent implements OnInit {
    action: string = 'Add Screen';
    isProcessing: boolean = false;
    selectedBranchId: number;
    screenDetails: ScreenDetails = new ScreenDetails();
    formGroup: FormGroup;

    showTimeList: string[] = [];

    constructor(
        private dialogService: DialogService,
        private screenService: ScreenService,
        private dialogRef: MatDialogRef<ScreenModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: ScreenModalData
    ) {
        this.dialogRef.disableClose = true;

        if (data?.action) {
            this.action = data.action;
        }
        if (data?.screenDetails) {
            this.screenDetails = data.screenDetails;
        }
        if (data?.branchId) {
            this.selectedBranchId = data.branchId;
        }
    }

    ngOnInit(): void {
        this.initShowTimeList();
        this.initializeFormGroup();
    }

    initShowTimeList() {
        for (let i = 0; i < 24; i++) {
            this.showTimeList.push(`${i < 10 ? '0' : ''}${i}:00`);
        }
    }

    initializeFormGroup() {
        this.formGroup = new FormGroup({
            screenName: new FormControl(this.screenDetails.screenName, [
                Validators.required,
                ValidationHelper.notWhiteSpace,
            ]),
            noOfSeats: new FormControl(this.screenDetails.noOfSeats, [Validators.required]),
            charge: new FormControl(this.screenDetails.charge, [Validators.required]),
            showTimes: new FormControl(this.screenDetails.showTimes || [], [Validators.required]),
        });
    }

    onShowTimeRemove(value: string) {
        const selectedShowTimes = this.formGroup.get('showTimes')?.value as string[];
        this.removeFirst(selectedShowTimes, value);
        this.formGroup.get('showTimes')?.setValue(selectedShowTimes); // To trigger change detection
    }

    private removeFirst(array: string[], toRemove: string): void {
        const index = array.indexOf(toRemove);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    close() {
        if (this.isProcessing) {
            return;
        }
        this.dialogRef.close();
    }

    async save() {
        if (this.isProcessing || !this.isScreenDetailsValid()) {
            return;
        }

        let isSuccess: boolean = true;
        if (this.action === 'Add Screen') {
            isSuccess = await this.addScreen();
        } else {
            isSuccess = await this.updateScreen();
        }

        if (!isSuccess) {
            return;
        }

        this.screenService.notifyRecordsHasChanges();
        this.close();
    }

    async addScreen(): Promise<boolean> {
        const data = {
            branchId: this.selectedBranchId,
            screenName: this.formGroup.get('screenName')?.value,
            noOfSeats: this.formGroup.get('noOfSeats')?.value,
            charge: this.formGroup.get('charge')?.value,
            showTimes: this.formGroup.get('showTimes')?.value,
        };

        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.screenService.addScreen(data));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Screen added successfully');
        return true;
    }

    async updateScreen(): Promise<boolean> {
        const data = {
            screenId: this.screenDetails.screenId,
            branchId: this.selectedBranchId,
            screenName: this.formGroup.get('screenName')?.value,
            noOfSeats: this.formGroup.get('noOfSeats')?.value,
            charge: this.formGroup.get('charge')?.value,
            showTimes: this.formGroup.get('showTimes')?.value,
        };

        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.screenService.updateScreen(data));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('Screen updated successfully');
        return true;
    }

    isScreenDetailsValid(): boolean {
        let isValid = !this.formGroup.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        }

        this.formGroup.markAllAsTouched();
        return isValid;
    }
}

export interface ScreenModalData {
    action: string;
    branchId: number;
    screenDetails?: ScreenDetails;
}
