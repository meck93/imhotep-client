import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {PyramidService} from "../../shared/services/pyramid/pyramid.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Game} from '../../shared/models/game';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'pyramid',
    templateUrl: './pyramid.component.html',
    styleUrls: ['./pyramid.component.css'],
    providers: [PyramidService]
})

export class PyramidComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    pyramidStones: Stone[][][] = [];
    additionalStones: number[] = [];
    hasShipDocked: boolean = false;
    pyramidId:number; // site ID to pass along to the site-harbor

    hasAdditionalStones: boolean = false;

    changedStones: boolean[] = [];
    additionalStonesChanged: boolean[] = [false, false, false, false];
    hasHarborUpdated: boolean = false;          // make changes visible to the user

    stoneCounter: number = 0;


    // TODO: refine point distribution for pyramid
    points: number[] = [
        2, 1, 3,
        2, 4, 3,
        2, 1, 3,

        2, 3,
        1, 3,

        4];

    constructor(private pyramidService: PyramidService) {

    }

    // initialize component
    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;

        this.updatePyramid();

        let that = this;
        this.timeoutId = setInterval(function () {
            that.updatePyramid();
        }, this.timeoutInterval);
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // Updates the stones-array via a GET request to the server
    updatePyramid(): void {
        this.pyramidService.updatePyramidStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // retrieve data
                    let pyramid = BuildingSite;
                    this.pyramidId = BuildingSite.id;

                    // update local data
                    this.updateData(pyramid);
                } else {
                    console.log("no games found");
                }
            })
    }

    // update data and make changes visible to the user
    updateData(pyramid: BuildingSite): void {
        // get stones of the pyramid
        let stones = pyramid.stones;

        // copy stones to later check if something has changed since the last polling
        let stones2 = JSON.parse(JSON.stringify(stones));

        // place stones at the pyramid
        let additionalStones = this.arrangePyramidLayers(stones);

        // make changes of the pyramid visible
        for (let i = 0; i < stones2.length; i++) {
            // if there was no stone before, something change since the last polling
            if (this.changedStones[i] == undefined) {
                this.changedStones.push(true);
            } else {
                this.changedStones[i] = false;
            }
        }

        // place all additional stones sorted to their color
        if (additionalStones.length > 0) {
            this.hasAdditionalStones = true;
            let additional = this.arrangeAdditionalStones(additionalStones);

            // make changes visible for additional stones
            for (let i=0; i<this.numberOfPlayers; i++) {
                // check for update
                this.additionalStonesChanged[i] = this.additionalStones[i] != additional[i];

                // save new state
                this.additionalStones[i] = additional[i];
            }
        }

        // check if ship docked
        //let hasDockedShip = pyramid.dockedShip;
        //this.hasHarborUpdated = this.hasShipDocked != hasDockedShip;
        this.hasShipDocked = pyramid.docked;
        //this.hasShipDocked = !this.hasShipDocked;     // enable fot docked ship demo
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    arrangePyramidLayers(stones: Stone[]): Stone[] {
        // size of a pyramid layer (from bottom to top, e.g. 3 means layer has capacity of 3x3 stones)
        let layerSize = [3, 2, 1];

        // amount of stones to place on a layer
        let amountOfStones;

        // stones to place on a layer
        let layerStones;

        // place all stones on the pyramid layers
        // iterate trough all layers and place stones
        for (let layer = 0; layer < layerSize.length; layer++) {
            // check if there are some stones left to place on this layer
            amountOfStones = (stones.length >= layerSize[layer] * layerSize[layer]) ? layerSize[layer] * layerSize[layer] : stones.length;
            if (amountOfStones > 0) {
                // get the number of stones to place on this layer
                layerStones = stones.splice(0, amountOfStones);

                // place stones on this layer
                this.pyramidStones[layer] = this.arrangeStonesOnLayer(layerStones, layerSize[layer]);
            }
        }

        // return stones that did not fit into the pyramid
        return stones;
    }

    arrangeStonesOnLayer(stones: Stone[], size: number): Stone[][] {
        let layerArray: Stone[][] = [];
        let nrOfRows = (stones.length / size);

        // splits the array into pieces of size (input)
        for (let i = 0; i < nrOfRows; i++) {
            let colArray = stones.splice(0, size);
            layerArray.push(colArray);
        }

        return layerArray;
    }

    arrangeAdditionalStones(stones: Stone[]): number[] {
        let additionalStones: number[] = [0, 0, 0, 0];

        for (let i = 0; i < stones.length; i++) {
            switch (stones[i].color) {
                case 'BLACK':
                    additionalStones[0]++;
                    break;
                case 'WHITE':
                    additionalStones[1]++;
                    break;
                case 'GRAY':
                    additionalStones[2]++;
                    break;
                case 'BROWN':
                    additionalStones[3]++;
                    break;
            }
        }

        return additionalStones;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    displayRule(): void {
        console.log("I rule!");
        let popup = document.getElementById("pyramidPopup");
        popup.classList.toggle("show");
    }
}
