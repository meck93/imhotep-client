import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
        // TODO: get ship ID's from game at game initialization (for ship polling)
    }
}
