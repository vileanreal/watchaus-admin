import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationComponent } from './navigation/navigation.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './auth.interceptor';
import { BlockUiComponent } from './_shared/components/block-ui/block-ui.component';
import { UserModalComponent } from './user-management/modal/user-modal/user-modal.component';
import { DialogComponent } from './_shared/components/dialog/dialog.component';
import { FooterComponent } from './footer/footer.component';
import { MovieManagementComponent } from './movie-management/movie-management.component';
import { MovieModalComponent } from './movie-management/modal/movie-modal/movie-modal.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MovieScreenshotsComponent } from './movie-management/movie-screenshots/movie-screenshots.component';
import { MovieDetailsComponent } from './movie-management/movie-details/movie-details.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        NavigationComponent,
        UserManagementComponent,
        BlockUiComponent,
        UserModalComponent,
        DialogComponent,
        FooterComponent,
        MovieManagementComponent,
        MovieModalComponent,
        MovieScreenshotsComponent,
        MovieDetailsComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },

        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
