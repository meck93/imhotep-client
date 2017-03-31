import {Component, OnInit, Input} from '@angular/core';
import {HarborService} from '../../shared/services/harbor/harbor.service';
import {Ship} from '../../shared/models/ship';
import {MOCKSHIPS} from '../../shared/models/mock-ships';

import Timer = NodeJS.Timer;

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css'],
    providers: [HarborService]
})
export class HarborComponent implements OnInit {
    ships: Ship[];

    private timoutId: Timer;
    private timoutInterval: number = 3000;

    constructor(private harborService: HarborService) {
    }

    ngOnInit() {
        this.getShips();
        //this.ships = MOCKSHIPS;


        // initialize and start polling
        let that = this;
        this.timoutId = setInterval(function () {
            //that.getShips();
        }, this.timoutInterval)
    }

    getShips(): void {
        this.ships = this.harborService.getShips();
    }
}
