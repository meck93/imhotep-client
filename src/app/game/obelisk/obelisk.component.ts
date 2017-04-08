import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ObeliskService} from "app/shared/services/obelisk/obelisk.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'obelisk',
    templateUrl: './obelisk.component.html',
    styleUrls: ['./obelisk.component.css'],
    providers: [ObeliskService]
})

export class ObeliskComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    //obelisk: BuildingSite;

    blackStoneCounter: number = 0;              // counts black stones
    whiteStoneCounter: number = 0;              // counts white stones
    grayStoneCounter: number = 0;               // counts gray stones
    brownStoneCounter: number = 0;              // counts brown stones

    points = [                                  // stores all points to determine max
        this.blackStoneCounter,
        this.whiteStoneCounter,
        this.grayStoneCounter,
        this.brownStoneCounter
    ];

    maxValue: number = 0;                       // max value of stones (highest obelisk)

    hasShipDocked: boolean = false;

    hasPlace1Updated: boolean = false;          // make changes visible to the user
    hasPlace2Updated: boolean = false;          // make changes visible to the user
    hasPlace3Updated: boolean = false;          // make changes visible to the user
    hasPlace4Updated: boolean = false;          // make changes visible to the user
    hasHarborUpdated: boolean = false;          // make changes visible to the user

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
        let blackStones = 0;
        let whiteStones = 0;
        let grayStones = 0;
        let brownStones = 0;
        let hasDockedShip = false;

        // iterate trough all stones of the obelisk site and count each color
        for (let i = 0; i < obelisk.stones.length; i++) {
            switch (obelisk.stones[i].color) {
                case 'BLACK': blackStones++; break;
                case 'WHITE': whiteStones++; break;
                case 'GRAY': grayStones++; break;
                case 'BROWN': brownStones++; break;
            }
        }
        hasDockedShip = obelisk.dockedShip;

        // check whether game status was updated
        this.hasPlace1Updated = this.blackStoneCounter != blackStones;
        this.hasPlace2Updated = this.whiteStoneCounter != whiteStones;
        this.hasPlace3Updated = this.grayStoneCounter != grayStones;
        this.hasPlace4Updated = this.brownStoneCounter != brownStones;
        this.hasHarborUpdated = this.hasShipDocked != hasDockedShip;

        // save new state
        this.blackStoneCounter = blackStones;
        this.whiteStoneCounter = whiteStones;
        this.grayStoneCounter = grayStones;
        this.brownStoneCounter = brownStones;
        this.points = [this.blackStoneCounter, this.whiteStoneCounter, this.grayStoneCounter, this.brownStoneCounter];

        this.hasShipDocked = obelisk.dockedShip;
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    findMaxValue() {
        let largest = this.points[0];
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i] > largest) {
                largest = this.points[i];
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
