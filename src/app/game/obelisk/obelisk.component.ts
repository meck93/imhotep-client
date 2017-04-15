import {Component, OnInit, Input, OnDestroy} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ObeliskService} from "app/shared/services/obelisk/obelisk.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {DraggableComponent} from "ng2-dnd";

@Component({
    selector: 'obelisk',
    templateUrl: './obelisk.component.html',
    styleUrls: ['./obelisk.component.css'],
    providers: [ObeliskService, DraggableComponent]
})

export class ObeliskComponent implements OnInit, OnDestroy {

    obeliskId: number; // site ID to pass along to the site-harbor

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    hasShipDocked: boolean = false;
    stoneCounter: number[] = [];      // keeps track of stones sorted by color/player
    hasPlaceUpdated: boolean[] = [];

    constructor(private obeliskService: ObeliskService) {

    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;

        // initialize variables that are dependent from amount of players
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.stoneCounter.push(0);
            this.hasPlaceUpdated.push(false);
        }

        this.updateObelisk();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateObelisk();
        }, this.timeoutInterval)
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

                    this.obeliskId = obelisk.id;

                    // update local data
                    this.updateData(obelisk);
                } else {
                    console.log("no games found");
                }
            })
    }

    // update data and make changes visible to the user
    updateData(obelisk: BuildingSite): void {
        // data that needs to be updated
        let stones: number[] = [];

        // initialize stone array according to number of players
        for (let i = 0; i < this.numberOfPlayers; i++) {
            stones.push(0);
        }

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

        // check whether some stones were added to the obelisks and save new state
        for (let i = 0; i < this.numberOfPlayers; i++) {
            // check for update
            this.hasPlaceUpdated[i] = this.stoneCounter[i] != stones[i];

            // save new state
            this.stoneCounter[i] = stones[i];
        }

        // update harbor
        this.hasShipDocked = obelisk.docked;
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************


    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    displayRule(): void {
        let popup = document.getElementById("obeliskPopup");
        popup.classList.toggle("show");
    }
}
