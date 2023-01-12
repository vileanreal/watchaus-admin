import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BranchManagementComponent } from './branch-management/branch-management.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MovieManagementComponent } from './movie-management/movie-management.component';
import { ScreenManagementComponent } from './screen-management/screen-management.component';
import { SettingsComponent } from './settings/settings.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'movie-management',
        component: MovieManagementComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'branch-management',
        component: BranchManagementComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'screen-management',
        component: ScreenManagementComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
