import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {}

    logout() {
        this.authService.logoutUser();
    }
}
