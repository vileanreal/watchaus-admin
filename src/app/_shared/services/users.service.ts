import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { UserDetails } from '../models/user-details';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private userRecordsHasChangesObservable: Observable<boolean>;
    private userRecordsHasChangeObserver: Observer<boolean>;

    constructor(private http: CustomHttp, private config: ConfigService) {
        this.userRecordsHasChangesObservable = new Observable((observer) => {
            this.userRecordsHasChangeObserver = observer;
        });
    }

    userRecordsHasChanges() {
        return this.userRecordsHasChangesObservable;
    }

    notifyRecordsHasChanges() {
        this.userRecordsHasChangeObserver?.next(true);
    }

    getUserList() {
        let url = this.config.getApiUrl() + 'user/get-user-list';
        let body = {};
        return this.http.post(url, body);
    }

    getUserDetails(username: string) {
        let url = this.config.getApiUrl() + `user/get-user-details/${username}`;
        return this.http.get(url);
    }

    addUser(userDetails: UserDetails) {
        let request = { ...userDetails };

        if (request.roleId == 0) {
            request.roleId = null;
        }
        if (request.branchId == 0) {
            request.branchId = null;
        }

        let url = this.config.getApiUrl() + 'user/add-user';
        let body = request;
        return this.http.post(url, body);
    }

    deleteUser(username: string) {
        let url = this.config.getApiUrl() + `user/delete-user/${username}`;
        let body = {};
        return this.http.delete(url, body);
    }

    updateUser(userDetails: UserDetails) {
        let request = { ...userDetails };
        let url = this.config.getApiUrl() + 'user/update-user';
        let body = request;
        return this.http.put(url, body);
    }
}
