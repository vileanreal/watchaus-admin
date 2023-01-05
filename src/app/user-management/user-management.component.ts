import { OnInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../_shared/services/users.service';
import { UserDetails } from '../_shared/models/user-details';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OperationResult } from '../_shared/models/operation-result';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './modal/user-modal/user-modal.component';
import { DialogService } from '../_shared/components/dialog/dialog.service';
@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    isProcessing: boolean = false;

    displayedColumns: string[] = ['username', 'firstName', 'lastName', 'roleName', 'action'];

    dataSource = new MatTableDataSource<UserDetails>();

    constructor(
        private dialogService: DialogService,
        private userService: UsersService,
        private toastr: ToastrService,
        public dialog: MatDialog
    ) {}

    async ngOnInit() {
        this.getUserList();

        this.userService.userRecordsHasChanges().subscribe({
            next: (x) => {
                this.getUserList();
            },
        });
    }

    async getUserList() {
        this.isProcessing = true;
        let result: OperationResult<UserDetails[]> = await firstValueFrom(this.userService.getUserList());
        this.isProcessing = false;
        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }

        this.dataSource = new MatTableDataSource<UserDetails>(result.data);
    }

    addNewUser() {
        this.dialog.open(UserModalComponent, {
            data: {
                action: 'Add User',
            },
        });
    }

    async deleteUser(username: string) {
        this.isProcessing = true;
        let result: OperationResult<any> = await firstValueFrom(this.userService.deleteUser(username));
        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            return;
        }

        this.userService.notifyRecordsHasChanges();
        this.toastr.success(`${username} successfully deleted!`);
    }

    confirmDeleteUser(username: string) {
        this.dialogService.confirmDialog({
            title: 'Delete user',
            message: 'Are you sure you want to delete this user?',
            callback: () => this.deleteUser(username),
        });
    }

    async getUserDetails(username: string): Promise<UserDetails | null> {
        let result: OperationResult<UserDetails> = await firstValueFrom(this.userService.getUserDetails(username));
        if (!result.isSuccess) {
            console.error(result.message);
            return null;
        }
        return result.data;
    }

    async updateUser(username: string) {
        this.isProcessing = true;
        let userDetails = await this.getUserDetails(username);
        this.isProcessing = false;

        if (!userDetails) {
            return;
        }

        this.dialog.open(UserModalComponent, {
            data: {
                action: 'Update User',
                userDetails,
            },
        });
    }
}
