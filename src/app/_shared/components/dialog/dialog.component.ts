import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
    title: string;
    message: string;
    isMessageOnly: boolean;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
    ) {
        this.dialogRef.disableClose = true;
        this.title = data.title;
        this.message = data.message;
        this.isMessageOnly = data.isMessageOnly;
    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }

    ngOnInit(): void {}
}

export class ConfirmDialogModel {
    constructor(public title: string, public message: string, public isMessageOnly: boolean) {}
}
