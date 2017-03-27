import {Component, OnInit} from '@angular/core';
import {BasicShip} from '../../shared/models/basicShip';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    dummyShips: BasicShip[] = [
        {
            id: 1,
            MIN_STONES: 2,
            MAX_STONES: 5
        },
        {
            id: 2,
            MIN_STONES: 1,
            MAX_STONES: 3
        },
        {
            id: 3,
            MIN_STONES: 3,
            MAX_STONES: 4
        },
        {
            id: 4,
            MIN_STONES: 1,
            MAX_STONES: 2
        },
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
