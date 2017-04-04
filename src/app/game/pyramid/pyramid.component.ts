import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
import Timer = NodeJS.Timer;
import {PyramidService} from "../../shared/services/pyramid/pyramid.service";

@Component({
    selector: 'pyramid',
    templateUrl: './pyramid.component.html',
    styleUrls: ['./pyramid.component.css'],
    providers: [PyramidService]
})
export class PyramidComponent implements OnInit {

    game: Game; // current game
    pyramid: BuildingSite;
    //stones: Stone[] = MOCKSTONES; // temporary, replaced by service
    stones: Stone[];
    pyramidStones: Stone[][][] = [];
    additionalStones: Stone[] = [];
    stoneCounter: number = 0;

    private timoutInterval: number = 3000;
    private timoutId: Timer;


    constructor(private pyramidService: PyramidService) {
    }

    ngOnInit() {
        //console.log("in Game Screen");
        this.game = JSON.parse(localStorage.getItem('currentGame'));
        this.updatePyramidStones();

        var that = this;
        this.timoutId = setInterval(function () {
            that.updatePyramidStones();
        }, this.timoutInterval)
    }

    arrangePyramidLayers(stones:Stone[]){
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

    // Updates the stones-array via a GET request to the server
    updatePyramidStones(): void {
        //console.log("updating burial chamber");
        this.pyramidService.updatePyramidStones(this.game.id)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    this.pyramid = BuildingSite;
                    this.stones = this.pyramid.stones;
                    console.log(this.pyramid.stones);

                    this.arrangePyramidLayers(this.stones);
                } else {
                    console.log("no games found");
                }
            })
    }
}
