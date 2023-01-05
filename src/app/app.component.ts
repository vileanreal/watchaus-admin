import { Component } from '@angular/core';
import { AuthService } from './_shared/services/auth.service';
import { ConfigService } from './_shared/services/config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'watchaus-admin';

    constructor(public authService: AuthService, private configService: ConfigService) {}

    ngOnInit() {
        this.configService.load();
    }
}
