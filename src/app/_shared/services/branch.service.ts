import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';
import { BranchDetails } from '../models/branch-details';

@Injectable({
    providedIn: 'root',
})
export class BranchService {
    private branchRecordsHasChangesObservable: Observable<boolean>;
    private branchRecordsHasChangeObserver: Observer<boolean>;

    constructor(private http: CustomHttp, private config: ConfigService) {
        this.branchRecordsHasChangesObservable = new Observable((observer) => {
            this.branchRecordsHasChangeObserver = observer;
        });
    }

    branchRecordsHasChanges() {
        return this.branchRecordsHasChangesObservable;
    }

    notifyRecordsHasChanges() {
        this.branchRecordsHasChangeObserver?.next(true);
    }

    getBranchList() {
        let url = this.config.getApiUrl() + 'branch/get-branch-list';
        let body = {};
        return this.http.post(url, body);
    }

    addBranch(branchDetails: { name: string }) {
        let url = this.config.getApiUrl() + 'branch/add-branch';
        let body = {
            name: branchDetails.name,
        };
        return this.http.post(url, body);
    }

    updateBranch(branchDetails: BranchDetails) {
        let url = this.config.getApiUrl() + 'branch/update-branch';
        let body = {
            branchId: branchDetails.branchId,
            name: branchDetails.name,
        };
        return this.http.put(url, body);
    }

    deleteBranch(branchId: number) {
        let url = this.config.getApiUrl() + `branch/delete-branch/${branchId}`;
        let body = {};
        return this.http.delete(url, body);
    }
}
