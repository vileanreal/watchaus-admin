import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-movie-screenshots',
    templateUrl: './movie-screenshots.component.html',
    styleUrls: ['./movie-screenshots.component.scss'],
})
export class MovieScreenshotsComponent implements OnInit {
    @Input() posterBase64: string = '';
    @Input() screenshotsBase64: string[] = [];

    @Output() onFileSelectEvent = new EventEmitter<MoveImgData>();

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        // encapsulate array
        this.screenshotsBase64 = this.screenshotsBase64 || [];
        this.screenshotsBase64 = [...this.screenshotsBase64];
    }

    emitImages() {
        this.onFileSelectEvent.emit({
            posterBase64: this.posterBase64,
            screenshotsBase64: this.screenshotsBase64,
        });
    }

    get moviePosterSafeUrl() {
        if (!this.posterBase64 || this.posterBase64 === '') {
            return '';
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + this.posterBase64);
    }

    get screenshotsSafeUrl() {
        return this.screenshotsBase64?.map((x) =>
            this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + x)
        );
    }

    selectPoster(event: any) {
        const file = event?.target?.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64 = reader.result?.toString().split('base64,')[1];
            this.posterBase64 = base64 || '';
            this.emitImages();
        };
    }

    selectScreenshots(event: any) {
        const count = event?.target?.files?.length;
        let ctr = 1;

        for (let file of event?.target?.files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64 = reader.result?.toString().split('base64,')[1];
                this.screenshotsBase64.push(base64 || '');
                if (ctr === count) {
                    this.emitImages();
                }
                ctr++;
            };
        }
    }
}

export interface MoveImgData {
    posterBase64: string;
    screenshotsBase64: string[];
}
