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

    // component fields
    pyramid: BuildingSite;
    stones: Stone[];
    pyramidStones: Stone[][][] = [];
    additionalStones: Stone[] = [];
    additionalBlackStones: number;
    additionalWhiteStones: number;
    additionalGrayStones: number;
    additionalBrownStones: number;

    stoneCounter: number = 0;

    constructor(private pyramidService: PyramidService) {

    }

    // initialize component
    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

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
                    // updates the stones array in this component
                    this.pyramid = BuildingSite;
                    this.stones = this.pyramid.stones;
                    this.arrangePyramidLayers(this.stones);
                } else {
                    console.log("no games found");
                }
            })
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    arrangePyramidLayers(stones:Stone[]){
        if(stones.length > 14){
            this.additionalStones = stones.splice(14,stones.length);
            this.arrangeAdditionalStones(this.additionalStones);
        }
        // size of a pyramid layer (from bottom to top, e.g. 3 means layer has capacity of 3x3 stones)
        let layerSize = [3, 2, 1];

        // amount of stones to place on a layer
        let amountOfStones;

        // stones to place on a layer
        let layerStones;

        // place all stones on the pyramid layers
        // iterate trough all layers and place stones
        for(let layer=0; layer<layerSize.length; layer++) {
            // check if there are some stones left to place on this layer
            amountOfStones = (stones.length >= layerSize[layer]*layerSize[layer]) ? layerSize[layer]*layerSize[layer] : stones.length;
            if (amountOfStones > 0) {
                // get the number of stones to place on this layer
                layerStones = stones.splice(0, amountOfStones);

                // place stones on this layer
                this.pyramidStones[layer] = this.arrangeStonesOnLayer(layerStones, layerSize[layer]);
            }
        }
    }

    arrangeStonesOnLayer(stones: Stone[], size:number): Stone[][] {
        let layerArray: Stone[][] = [];
        let nrOfRows = (stones.length / size);

        // splits the array into pieces of size (input)
        for (let i = 0; i < nrOfRows; i++) {
            let colArray = stones.splice(0, size);
            layerArray.push(colArray);
        }

        return layerArray;
    }

    arrangeAdditionalStones(stones:Stone[]):void{
        let blackStones = 0;
        let whiteStones = 0;
        let grayStones = 0;
        let brownStones = 0;

        console.log(stones);

        for(var i=0; i<stones.length;i++){
            if(stones[i].color == 'BLACK'){
                blackStones++;
            }
            if(stones[i].color == 'WHITE'){
                whiteStones++;
            }
            if(stones[i].color == 'GRAY'){
                grayStones++;
            }
            if(stones[i].color == 'BROWN'){
                brownStones++;
            }
        }

        this.additionalBlackStones = blackStones;
        this.additionalWhiteStones = whiteStones;
        this.additionalGrayStones= grayStones;
        this.additionalBrownStones= brownStones;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    displayRule():void{
        console.log("I rule!");
        let popup = document.getElementById("pyramidPopup");
        popup.classList.toggle("show");
    }
}
