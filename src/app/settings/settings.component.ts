import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../_shared/components/dialog/dialog.service';
import { OperationResult } from '../_shared/models/operation-result';
import { Setting } from '../_shared/models/setting';
import { SettingService } from '../_shared/services/setting.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    isProcessing: boolean = false;
    settingList: Setting[] = [];

    constructor(
        private settingService: SettingService,
        private toastr: ToastrService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.getSettingList();
        this.settingService.recordsHasChanges().subscribe({
            next: () => {
                this.getSettingList();
            },
        });
    }

    async getSettingList() {
        this.isProcessing = true;
        const apiResult: OperationResult<Setting[]> = await firstValueFrom(this.settingService.getSettingList());
        this.isProcessing = false;

        if (!apiResult.isSuccess) {
            this.toastr.error('Unable to get setting list');
            return;
        }

        this.settingList = apiResult.data;
    }

    async proceedToSave() {
        this.isProcessing = true;
        const apiResult: OperationResult<any> = await firstValueFrom(
            this.settingService.updateSettings(this.settingList)
        );
        this.isProcessing = false;

        if (!apiResult.isSuccess) {
            this.toastr.error('Error while saving settings');
            return;
        }

        this.toastr.success('Successfully save settings');
    }

    confirmSave() {
        console.table(this.settingList);
        this.dialogService.confirmDialog({
            title: 'Save Settings',
            message: 'Are you sure you want to save changes?',
            callback: () => this.proceedToSave(),
        });
    }
}
