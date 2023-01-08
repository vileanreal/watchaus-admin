import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from '../_shared/models/operation-result';
import { Router } from '@angular/router';
import { LoggonedUserDetails } from '../_shared/models/loggoned-user-details';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    username: string = 'vldelacruz';
    password: string = 'wuhu1IUy';
    loginValid: boolean = true;
    isProcessing: boolean = false;

    constructor(private toastr: ToastrService, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {}

    async login() {
        this.isProcessing = true;

        let result: OperationResult<LoggonedUserDetails> = await firstValueFrom(
            this.authService.loginUser(this.username, this.password)
        );

        this.isProcessing = false;

        if (!result.isSuccess) {
            this.toastr.error(result.message);
            this.loginValid = false;
            return;
        }
        sessionStorage.setItem('userDetails', JSON.stringify(result.data));
        sessionStorage.setItem('token', result.data.token);
        this.router.navigate(['/home']);
    }
}
