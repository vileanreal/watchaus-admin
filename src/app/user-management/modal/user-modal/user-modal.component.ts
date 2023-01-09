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
import { BranchService } from 'src/app/_shared/services/branch.service';
import { BranchDetails } from 'src/app/_shared/models/branch-details';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
    action: string = 'Add User';
    userDetails: UserDetails = new UserDetails();
    branchList: BranchDetails[] = [];
    isProcessing: boolean = false;
    formGroup: FormGroup;

    constructor(
        private branchService: BranchService,
        private userService: UsersService,
        private dialogRef: MatDialogRef<UserModalComponent>,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: UserModalData
    ) {
        this.dialogRef.disableClose = true;
        this.dialogRef.addPanelClass('dialog-1000');

        if (data && data.action) {
            this.action = data.action;
        }
        if (data?.userDetails) {
            this.userDetails = data.userDetails;
        }
    }

    async ngOnInit(): Promise<void> {
        this.initBranchList();
        this.initializeFormGroup();
    }

    async initBranchList() {
        const apiResult: OperationResult<BranchDetails[]> = await firstValueFrom(this.branchService.getBranchList());
        if (apiResult.isSuccess) {
            this.branchList = apiResult.data;
        }
    }

    initializeFormGroup() {
        // init form group
        this.formGroup = new FormGroup({
            username: new FormControl(this.userDetails.username, [Validators.required, ValidationHelper.notWhiteSpace]),
            firstName: new FormControl(this.userDetails.firstName, [
                Validators.required,
                ValidationHelper.notWhiteSpace,
            ]),
            middleName: new FormControl(this.userDetails.middleName, [ValidationHelper.notWhiteSpace]),
            lastName: new FormControl(this.userDetails.lastName, [Validators.required, ValidationHelper.notWhiteSpace]),
            phoneNo: new FormControl(this.userDetails.phoneNo, [ValidationHelper.notWhiteSpace]),
            email: new FormControl(this.userDetails.email, [
                Validators.required,
                ValidationHelper.notWhiteSpace,
                Validators.email,
            ]),
            roleId: new FormControl(this.userDetails.roleId || 0, [Validators.required, ValidationHelper.id]),
            branchId: new FormControl(
                this.userDetails.branchId || 0,
                this.userDetails.roleId === Roles.OPERATOR ? [Validators.required, ValidationHelper.id] : null
            ),
        });

        // map values to user obj
        this.formGroup.valueChanges.subscribe({
            next: (values) => {
                this.userDetails = {
                    ...this.userDetails,
                    ...values,
                };
            },
        });

        // handle conditional validator
        this.formGroup.get('roleId')?.valueChanges.subscribe({
            next: (value) => {
                if (value === Roles.OPERATOR) {
                    this.formGroup.get('branchId')?.setValidators([Validators.required, ValidationHelper.id]);
                } else {
                    this.formGroup.get('branchId')?.clearValidators();
                }
                this.formGroup.get('branchId')?.updateValueAndValidity({ onlySelf: true });
                this.formGroup.get('branchId')?.markAsTouched();
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
        if (this.isProcessing || !this.isUserDetailsValid()) {
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
        let isValid = !this.formGroup.invalid;

        if (!isValid) {
            this.toastr.warning('Please fill up all the required inputs');
        }

        this.formGroup.markAllAsTouched();
        return isValid;
    }
}

export class UserModalData {
    action: string;
    userDetails?: UserDetails;
}
