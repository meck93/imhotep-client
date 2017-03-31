import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BurialChamberService} from "../../shared/services/burial-chamber/burial-chamber.service";


@Component({
    selector: 'burial-chamber',
    templateUrl: './burial-chamber.component.html',
    styleUrls: ['./burial-chamber.component.css'],
    providers: [BurialChamberService]
})
export class BurialChamberComponent implements OnInit {

    game: Game;
    // replaces the MOCKSTONES-array when GET request is available
    //stones: Stone[];
    stones: Stone[] = MOCKSTONES;
    rows: Stone[][] = [];
    nrOfRows: number = (this.stones.length) / 3;


    constructor(private burialChamberService: BurialChamberService) {
    }

    ngOnInit() {

        this.game = JSON.parse(localStorage.getItem('currentGame'));
        this.arrangeStones();
        //this.updateBurialChamberStones();
    }


    arrangeStones(): void {
        for (var i = 0; i < this.nrOfRows; i++) {
            var oneRowArray = this.stones.splice(0, 3);
            this.rows.push(oneRowArray);
            console.log(oneRowArray);
        }
        console.log(this.rows);
    }

    // Updates the stones-array via a GET request to the server
    updateBurialChamberStones(): void {
        console.log("updating burial chamber");
        this.burialChamberService.updateBurialChamberStones(this.game.id)
            .subscribe(stones => {
                if (stones) {
                    // updates the stones array in this component
                    this.stones = stones;
                } else {
                    console.log("no games found");
                }
            })
    }

}


