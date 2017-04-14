import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ObeliskService} from "app/shared/services/obelisk/obelisk.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Stone} from '../../shared/models/stone';
import {Ship} from '../../shared/models/ship';
import {DragulaService} from "ng2-dragula";
import {DraggableComponent} from "ng2-dnd";

@Component({
    selector: 'obelisk',
    templateUrl: './obelisk.component.html',
    styleUrls: ['./obelisk.component.css'],
    providers: [ObeliskService, DraggableComponent]
})

export class ObeliskComponent implements OnInit {
    receivedData: Array<any> = [];
    dockedShip: Ship;

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    hasShipDocked: boolean = false;
    stoneCounter: number[] = [0, 0, 0, 0];      // keeps track of stones sorted by color/player

    maxValue: number = 0;                       // max value of stones (highest obelisk)

    hasPlaceUpdated: boolean[] = [false, false, false, false];

    constructor(private obeliskService: ObeliskService) {

    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;

        this.updateObelisk();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateObelisk();
        }, this.timeoutInterval)
    }

    transferDataSuccess(event) {
        console.log(event);
        this.dockedShip = JSON.parse(event.dragData);
        console.log(this.dockedShip);
        console.log(this.dockedShip.id);
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // get actual obelisk state from server, update local obelisk data and display changes to the user
    updateObelisk(): void {
        // get data from server
        this.obeliskService.updateObeliskStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // retrieved data
                    let obelisk = BuildingSite;

                    // update local data
                    this.updateData(obelisk);

                    this.findMaxValue();
                } else {
                    console.log("no games found");
                }
            })
    }

    // update data and make changes visible to the user
    updateData(obelisk: BuildingSite): void {
        // data that needs to be updated
        let stones: number[] = [0, 0, 0, 0];
        let hasDockedShip = false;

        // iterate trough all stones of the obelisk site and count each color
        for (let i = 0; i < obelisk.stones.length; i++) {
            switch (obelisk.stones[i].color) {
                case 'BLACK':
                    stones[0]++;
                    break;
                case 'WHITE':
                    stones[1]++;
                    break;
                case 'GRAY':
                    stones[2]++;
                    break;
                case 'BROWN':
                    stones[3]++;
                    break;
            }
        }
        hasDockedShip = obelisk.dockedShip;

        // check whether some stones were added to the obelisks and save new state
        for (let i = 0; i < this.numberOfPlayers; i++) {
            // check for update
            this.hasPlaceUpdated[i] = this.stoneCounter[i] != stones[i];

            // save new state
            this.stoneCounter[i] = stones[i];
        }

        // update harbor
        this.hasShipDocked = obelisk.dockedShip;
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    findMaxValue() {
        let largest = this.stoneCounter[0];
        for (let i = 1; i < this.stoneCounter.length; i++) {
            if (this.stoneCounter[i] > largest) {
                largest = this.stoneCounter[i];
            }
        }
        this.maxValue = largest;
    }


    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    displayRule(): void {
        console.log("I rule!");
        let popup = document.getElementById("obeliskPopup");
        popup.classList.toggle("show");
    }

    amountOfPlayers(): number {
        return this.numberOfPlayers;
    }
}
