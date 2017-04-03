import {Component, OnInit, Input} from '@angular/core';
import {HarborService} from '../../shared/services/harbor/harbor.service';
import {Ship} from '../../shared/models/ship';
import {Round} from '../../shared/models/Round';
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
        let game = JSON.parse(localStorage.getItem('currentGame'));
        let gameId = game.id;
        let roundNumber = game.roundCounter;
        roundNumber = 1;

        //this.getShips2(gameId, roundNumber);
        this.getShips();

        // initialize and start polling
        let that = this;
        this.timoutId = setInterval(function () {
            //that.getShips();
        }, this.timoutInterval)
    }

    getShips(): void {
        this.ships = this.harborService.getShips();
    }

    getShips2(gameId:number, roundNumber:number): void {
        this.harborService.getRound(gameId, roundNumber)
            .subscribe(round => {
                if (round) {
                    this.ships = round.ships;
                    console.log(this.ships);
                    //this.ships = MOCKSHIPS;
                } else {
                    console.log("Error!");
                }
            })
    }
}
