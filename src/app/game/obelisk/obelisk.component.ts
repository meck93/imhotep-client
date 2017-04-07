import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ObeliskService} from "app/shared/services/obelisk/obelisk.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Game} from '../../shared/models/game';
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

    whiteStoneCounter: number = 0;
    blackStoneCounter: number = 0;
    grayStoneCounter: number = 0;
    brownStoneCounter: number = 0;

    points = [
        this.whiteStoneCounter,
        this.blackStoneCounter,
        this.grayStoneCounter,
        this.brownStoneCounter
    ];

    maxValue: number = 0;

    constructor(private obeliskService: ObeliskService) {

    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;


        this.updateObelisk();

        /*POLLING*/
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
                    console.log(this.obelisk.stones);
                    this.addStones(this.obelisk.stones);
                    this.points = [this.whiteStoneCounter, this.blackStoneCounter, this.grayStoneCounter, this.brownStoneCounter];
                    this.findMaxValue();
                } else {
                    console.log("no games found");
                }
            })
    }

    addStones(stones: Stone[]): void {
        let white = 0;
        let black = 0;
        let gray = 0;
        let brown = 0;
        for (let i = 0; i < stones.length; i++) {
            if (stones[i].color == 'WHITE') {
                white++;
            }
            if (stones[i].color == 'BLACK') {
                black++;
            }
            if (stones[i].color == 'GRAY') {
                gray++;
            }
            if (stones[i].color == 'BROWN') {
                brown++;
            }
        }
        this.whiteStoneCounter = white;
        this.blackStoneCounter = black;
        this.grayStoneCounter = gray;
        this.brownStoneCounter = brown;
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    findMaxValue() {
        let largest = this.points[0];
        for (let i = 0; i < this.points.length; i++) {
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
