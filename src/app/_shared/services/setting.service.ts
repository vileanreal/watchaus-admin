import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Setting } from '../models/setting';
import { ConfigService } from './config.service';
import { CustomHttp } from './custom-http.service';

@Injectable({
    providedIn: 'root',
})
export class SettingService {
    private recordsHasChangesObservable: Observable<boolean>;
    private recordsHasChangeObserver: Observer<boolean>;

    constructor(private http: CustomHttp, private config: ConfigService) {
        this.recordsHasChangesObservable = new Observable((observer) => {
            this.recordsHasChangeObserver = observer;
        });
    }

    recordsHasChanges() {
        return this.recordsHasChangesObservable;
    }

    notifyRecordsHasChanges() {
        this.recordsHasChangeObserver?.next(true);
    }

    getSettingList() {
        const url = this.config.getApiUrl() + `settings/get-setting-list`;
        const body = {};
        return this.http.post(url, body);
    }

    updateSettings(settings: Setting[]) {
        const url = this.config.getApiUrl() + `settings/update-settings`;
        const body = {
            settingList: [...settings],
        };
        return this.http.put(url, body);
    }
}
