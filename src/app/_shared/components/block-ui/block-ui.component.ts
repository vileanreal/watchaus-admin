import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-block-ui',
    templateUrl: './block-ui.component.html',
    styleUrls: ['./block-ui.component.scss'],
})
export class BlockUiComponent implements OnInit {
    @Input() blockUI: boolean = false;

    constructor() {}

    ngOnInit(): void {}
}
