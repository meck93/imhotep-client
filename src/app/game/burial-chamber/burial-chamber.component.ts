import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
import {BurialChamberService} from "../../shared/services/burial-chamber/burial-chamber.service";
import Timer = NodeJS.Timer;


@Component({
    selector: 'burial-chamber',
    templateUrl: './burial-chamber.component.html',
    styleUrls: ['./burial-chamber.component.css'],
    providers: [BurialChamberService]
})
export class BurialChamberComponent implements OnInit {

    game: Game;
    burialChamber: BuildingSite;
    // replaces the MOCKSTONES-array when GET request is available
    //stones: Stone[] = MOCKSTONES;
    rows: Stone[][] = [];
    nrOfRows: number;

    private timoutInterval: number = 3000;
    private timoutId: Timer;


    constructor(private burialChamberService: BurialChamberService) {
    }

    ngOnInit() {

        console.log("in Game Screen");
        this.game = JSON.parse(localStorage.getItem('currentGame'));
        this.updateBurialChamberStones();


         var that = this;
         this.timoutId = setInterval(function () {
         that.updateBurialChamberStones();
         }, this.timoutInterval)
    }


    arrangeStones(stones: Stone[]): void {
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length/3);
        console.log("arrangeStoneBeginning");

        for (var i = 0; i < this.nrOfRows; i++) {
            var oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
            console.log(oneRowArray);
        }

        this.rows = tempArray;
        console.log(this.rows);

    }

    // Updates the stones-array via a GET request to the server
    updateBurialChamberStones(): void {
        console.log("updating burial chamber");
        this.burialChamberService.updateBurialChamberStones(this.game.id)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    this.burialChamber = BuildingSite;
                    console.log("there should be " + this.burialChamber.stones.length +" Stones");
                    console.log(this.burialChamber.stones);
                    this.arrangeStones(this.burialChamber.stones);
                } else {
                    console.log("no games found");
                }
            })
    }

}


