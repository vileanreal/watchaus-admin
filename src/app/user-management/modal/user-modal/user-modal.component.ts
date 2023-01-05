import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OperationResult } from 'src/app/_shared/models/operation-result';
import { UserDetails } from 'src/app/_shared/models/user-details';
import { UsersService } from 'src/app/_shared/services/users.service';
import { firstValueFrom } from 'rxjs';
import { Roles } from 'src/app/_shared/constants/constant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationHelper } from 'src/app/_shared/helpers/validators';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
    action: string = 'Add User';
    userDetails: UserDetails = new UserDetails();
    isProcessing: boolean = false;

    userControl: FormGroup = new FormGroup({
        username: new FormControl('', [Validators.required, ValidationHelper.notWhiteSpace]),
        firstName: new FormControl('', [Validators.required, ValidationHelper.notWhiteSpace]),
        lastName: new FormControl('', [Validators.required, ValidationHelper.notWhiteSpace]),
        email: new FormControl('', [Validators.required, ValidationHelper.notWhiteSpace, Validators.email]),
        roleId: new FormControl('', [Validators.required, ValidationHelper.id]),
        branchId: new FormControl(0, null),
    });

    constructor(
        private userService: UsersService,
        private dialogRef: MatDialogRef<UserModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: UserModalData
    ) {
        this.dialogRef.disableClose = true;
        this.dialogRef.addPanelClass('full-width-dialog');

        if (data && data.action) {
            this.action = data.action;
        }
        if (data?.userDetails) {
            this.userDetails = data.userDetails;
        }
    }

    ngOnInit(): void {
        this.cleanUserDetailsDirtyValue();
        this.initializeUserControl();
    }

    cleanUserDetailsDirtyValue() {
        this.userDetails.roleId = this.userDetails.roleId || 0;
        this.userDetails.branchId = this.userDetails.branchId || 0;
    }

    initializeUserControl() {
        this.userControl.get('roleId')?.valueChanges.subscribe({
            next: (value) => {
                if (value === Roles.OPERATOR) {
                    this.userControl.get('branchId')?.setValidators([Validators.required, ValidationHelper.id]);
                } else {
                    this.userControl.get('branchId')?.clearValidators();
                }
                this.userControl.get('branchId')?.updateValueAndValidity();
            },
        });
    }

    get isDisableUsername() {
        return this.action === 'Update User';
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
        if (!this.isUserDetailsValid()) {
            return;
        }
        let isSuccess: boolean = true;

        if (this.action === 'Add User') {
            isSuccess = await this.addUser();
        } else {
            isSuccess = await this.updateUser();
        }

        if (!isSuccess) {
            return;
        }

        this.userService.notifyRecordsHasChanges();
        this.close();
    }

    async addUser(): Promise<boolean> {
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.userService.addUser(this.userDetails));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('User added successfully');
        return true;
    }

    async updateUser(): Promise<boolean> {
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.userService.updateUser(this.userDetails));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return false;
        }

        this.toastr.success('User updated successfully');
        return true;
    }

    isUserDetailsValid(): boolean {
        let isValid = !this.userControl.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        }

        this.userControl.markAllAsTouched();
        return isValid;
    }
}

export class UserModalData {
    action: string;
    userDetails?: UserDetails;
}
