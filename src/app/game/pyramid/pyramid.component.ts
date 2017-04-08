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

    hasAdditionalStones: boolean = false;

    stoneCounter: number = 0;

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
        }, this.timeoutInterval)
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

                    // update local data
                    this.updateData(pyramid);
                } else {
                    console.log("no games found");
                }
            })
    }

    // update data and make changes visible to the user
    updateData(pyramid: BuildingSite): void {
        let stones = pyramid.stones;

        // place stones at the pyramid
        let additionalStones = this.arrangePyramidLayers(stones);

        // place all additional stones sorted to their color
        if (additionalStones.length > 0) {
            this.hasAdditionalStones = true;
            this.arrangeAdditionalStones(additionalStones);
        }
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

    arrangeAdditionalStones(stones: Stone[]): void {
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

        this.additionalStones = additionalStones;
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
