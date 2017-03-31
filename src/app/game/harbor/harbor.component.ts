import {Component, OnInit, Input} from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {MOCKSHIPS} from '../../shared/models/mock-ships';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    ships: Ship[];

    constructor() {

    }

    ngOnInit() {
        this.ships = MOCKSHIPS;
    }
}
