import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
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
    // #newWay
    gameId: number;

    burialChamber: BuildingSite; // building site object
    rows: Stone[][] = []; // the rows for the stones on this building site
    nrOfRows: number; // in how many rows the stones are split into

    // polling timber
    private timoutInterval: number = 3000;
    private timoutId: Timer;


    constructor(private burialChamberService: BurialChamberService) {
    }

    ngOnInit() {
        // #newWay
        // get game id from local storage
        let game = this.gameId = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get the stones from the server
        this.updateBurialChamberStones();

        /*POLLING*/
        var that = this;
        this.timoutId = setInterval(function () {
            that.updateBurialChamberStones();
        }, this.timoutInterval)
    }

    displayRule():void{
        // displays the rules popup
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
    }

    // places the current stones in rows for the component to display in the html
    arrangeStones(stones: Stone[]): void {
        // temporary stone array
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);

        for (var i = 0; i < this.nrOfRows; i++) {
            //splits the array into pieces of 3
            var oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
        }

        this.rows = tempArray;

    }

    //TODO: handle error
    // Updates the stones-array via a GET request to the server
    updateBurialChamberStones(): void {
        //console.log("updating burial chamber");
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

}


