import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
//import {PyramidService} from "../../shared/services/burial-chamber/pyramid.service"; /*TODO HAS TO BE CREATED
import Timer = NodeJS.Timer;

@Component({
    selector: 'pyramid',
    templateUrl: './pyramid.component.html',
    styleUrls: ['./pyramid.component.css']
})
export class PyramidComponent implements OnInit {

    game: Game; // current game
    pyramid: BuildingSite;
    stones: Stone[] = MOCKSTONES; // temporary, replaced by service
    pyramidStones: Stone[][][] = [];
    additionalStones: Stone[] = [];
    stoneCounter: number = 0;


    constructor() {
    }

    ngOnInit() {
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
            amountOfStones = (this.stones.length >= layerSize[layer]*layerSize[layer]) ? layerSize[layer]*layerSize[layer] : this.stones.length;
            if (amountOfStones > 0) {
                // get the number of stones to place on this layer
                layerStones = this.stones.splice(0, amountOfStones);

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
}
