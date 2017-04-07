import {Component, OnInit} from '@angular/core';

// polling
import Timer = NodeJS.Timer;

// services
import {BurialChamberService} from "../../shared/services/burial-chamber/burial-chamber.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Game} from '../../shared/models/game';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'burial-chamber',
    templateUrl: './burial-chamber.component.html',
    styleUrls: ['./burial-chamber.component.css'],
    providers: [BurialChamberService]
})
export class BurialChamberComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = 3000;

    // local storage data
    gameId: number;

    // component fields
    burialChamber: BuildingSite;        // building site object
    rows: Stone[][] = [];               // the rows for the stones on this building site
    nrOfRows: number;                   // in how many rows the stones are split into

    constructor(private burialChamberService: BurialChamberService) {

    }

    // initialize component
    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get the stones from the server
        this.updateBurialChamber();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateBurialChamber();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // TODO: handle error
    // updates the stones-array via a GET request to the server
    updateBurialChamber(): void {
        // console.log("updating burial chamber");
        this.burialChamberService.updateBurialChamberStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    this.burialChamber = BuildingSite;
                    this.arrangeStones(this.burialChamber.stones);
                } else {
                    console.log("no games found");
                }
            })
    }

    // places the current stones in rows for the component to display in the html
    arrangeStones(stones: Stone[]): void {
        // temporary stone array
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);

        for (let i = 0; i < this.nrOfRows; i++) {
            // splits the array into pieces of 3
            let oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
        }

        this.rows = tempArray;

    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // displays the rules popup
    displayRule(): void {
        let popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
    }
}
