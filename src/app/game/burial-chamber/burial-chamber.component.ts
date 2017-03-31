import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';


@Component({
    selector: 'burial-chamber',
    templateUrl: './burial-chamber.component.html',
    styleUrls: ['./burial-chamber.component.css']
})
export class BurialChamberComponent implements OnInit {

    stones: Stone[] = MOCKSTONES;
    rows: Stone[][] = [];
    nrOfRows: number = (this.stones.length) / 3;

    constructor() {
    }

    ngOnInit() {
        this.arrangeStones();
    }

    arrangeStones(): void {
        for (var i = 0; i < this.nrOfRows; i++) {
                var oneRowArray = this.stones.splice(0,3);
                this.rows.push(oneRowArray);
            console.log(oneRowArray);
            }
        console.log(this.rows);
    }

}
