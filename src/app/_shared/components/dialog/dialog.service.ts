import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    showMessage(options: { title: string; message: string }) {
        const dialogRef = this.dialog.open(DialogComponent, {
            maxWidth: '400px',
            data: {
                ...options,
                isMessageOnly: true,
            },
        });
    }

    confirmDialog(data: { title: string; message: string; callback: () => any }): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            maxWidth: '400px',
            data: {
                title: data.title,
                message: data.message,
                isMessageOnly: false,
            },
        });

        dialogRef.afterClosed().subscribe((clickYes) => {
            if (clickYes) {
                data.callback();
            }
        });
    }
}
