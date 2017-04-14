import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {TempleService} from "../../shared/services/temple/temple.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Game} from '../../shared/models/game';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'temple',
    templateUrl: './temple.component.html',
    styleUrls: ['./temple.component.css'],
    providers: [TempleService]
})

export class TempleComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    temple: BuildingSite;
    topLayer5: Stone[] = [];         // top stone layer 5 players
    topLayer4: Stone[] = [];         // top stone layer 4 players
    changedStones: boolean[] = [];   // array to keep track of changed stones;
    hasHarborUpdated: boolean = false;          // make changes visible to the user

    hasShipDocked: boolean = false;

    constructor(private templeService: TempleService) {

    }

    ngOnInit() {
        // get game id and number of players from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;

        // get current temple stones from the server
        this.updateTemple();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateTemple();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // get current stones from the server
    updateTemple(): void {
        //console.log("updating burial chamber");
        this.templeService.updateTempleStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    let temple = BuildingSite;

                    // update local data
                    this.updateData(temple);
                } else {
                    console.log("no games found");
                }
            })
    }

    // update data and make changes visible to the user
    updateData(temple: BuildingSite): void {
        // save stones of the temple
        let stones = temple.stones;

        /*FOR LESS THAN 3 PLAYERS*/
        if (this.numberOfPlayers < 3) {
            // save the current top-layer
            let currentLayer = this.topLayer4;
            // get the new topLayer
            let newLayer = this.arrangeTempleStones(stones);

            // compare currentLayer and NewLayer for changes
            for (let i = 0; i < newLayer.length; i++) {
                let index = i % 4;

                // first iteration - nothing to compare, all new stones
                // set change to true if the ids of there currently looked at stones are not the same
                if (currentLayer[index] == undefined || currentLayer[index].id != newLayer[index].id) {
                    this.changedStones.splice(index, 1);
                    this.changedStones.splice(index, 0, true);
                } else {
                    // nothing changed
                    this.changedStones.splice(index, 1);
                    this.changedStones.splice(index, 0, false);
                }
            }
            // set currentTopLayer equal the new topLayer
            this.topLayer4 = newLayer;

            // update docked ship
            // check if ship docked
            let hasDockedShip = temple.dockedShip;
            this.hasHarborUpdated = this.hasShipDocked != hasDockedShip;
            this.hasShipDocked = temple.dockedShip;
        }

        /*FOR more THAN 2 PLAYERS*/
        if (this.numberOfPlayers > 2) {
            // save the current top-layer
            let currentLayer = this.topLayer5;
            // get the new topLayer
            let newLayer = this.arrangeTempleStones(stones);

            // compare currentLayer and NewLayer for changes
            for (let i = 0; i < newLayer.length; i++) {
                let index = i % 5;

                // first iteration - nothing to compare, all new stones
                // set change to true if the ids of there currently looked at stones are not the same
                if (currentLayer[index] == undefined || currentLayer[index].id != newLayer[index].id) {
                    this.changedStones.splice(index, 1);
                    this.changedStones.splice(index, 0, true);
                } else {
                    // nothing changed
                    this.changedStones.splice(index, 1);
                    this.changedStones.splice(index, 0, false);
                }
            }
            // set currentTopLayer equal the new topLayer
            this.topLayer5 = newLayer;
        }
    }


    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // arrange the top layer stones to be displayed
    arrangeTempleStones(stones: Stone[]): Stone[] {
        // if 2 players
        if (this.numberOfPlayers < 3) {
            let temp = [];
            for (let i = 0; i < stones.length; i++) {
                let index = i % 4;
                temp.splice(index, 1);
                temp.splice(index, 0, stones[i]);
            }
            return temp;
        } else { // if more than 2 players
            let temp = [];
            for (let i = 0; i < stones.length; i++) {
                let index = i % 5;
                temp.splice(index, 1);
                temp.splice(index, 0, stones[i]);
            }
            return temp;
        }
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // display the rule popup
    displayRule(): void {
        let popup = document.getElementById("templePopup");
        popup.classList.toggle("show");
    }
}
