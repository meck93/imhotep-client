import {Component, OnInit, Input} from '@angular/core';
import {BasicShip} from '../../shared/models/basicShip';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    ships: BasicShip;
    // input variable for component
    @Input() SHIPS: BasicShip =
        {
            id: 0,
            MIN_STONES: 0,
            MAX_STONES: 0,
            stones: [{id: 0, color: ''}]
        };

    constructor() {
    }

    ngOnInit() {
        this.ships = this.SHIPS;
    }

}
