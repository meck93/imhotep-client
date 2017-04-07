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
    obelisk: BuildingSite;

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

    updateObelisk(): void {
        this.obeliskService.updateObeliskStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    this.obelisk = BuildingSite;

                    // update stones
                    this.addStones(this.obelisk.stones);

                    // update harbor
                    this.hasHarborUpdated = this.hasShipDocked != this.obelisk.dockedShip;
                    this.hasShipDocked = this.obelisk.dockedShip;

                    this.findMaxValue();
                } else {
                    console.log("no games found");
                }
            })
    }

    addStones(stones: Stone[]): void {
        let black = 0;
        let white = 0;
        let gray = 0;
        let brown = 0;

        // iterate trough all stones of the obelisk site and count each color
        for (let i = 0; i < stones.length; i++) {
            if (stones[i].color == 'BLACK') {
                black++;
            }
            if (stones[i].color == 'WHITE') {
                white++;
            }
            if (stones[i].color == 'GRAY') {
                gray++;
            }
            if (stones[i].color == 'BROWN') {
                brown++;
            }
        }

        // check whether game status was updated
        this.hasPlace1Updated = this.blackStoneCounter != black;
        this.hasPlace2Updated = this.whiteStoneCounter != white;
        this.hasPlace3Updated = this.grayStoneCounter != gray;
        this.hasPlace4Updated = this.brownStoneCounter != brown;

        // save new state
        this.blackStoneCounter = black;
        this.whiteStoneCounter = white;
        this.grayStoneCounter = gray;
        this.brownStoneCounter = brown;
        this.points = [this.blackStoneCounter, this.whiteStoneCounter, this.grayStoneCounter, this.brownStoneCounter];
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
