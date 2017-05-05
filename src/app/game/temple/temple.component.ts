import {Component, OnInit, Input, OnDestroy} from '@angular/core';

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

export class TempleComponent implements OnInit, OnDestroy {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;

    @Input() IS_PLAYING_CARD: boolean = false;      // flag if player is playing a market card
    @Input() CARD_ID: number = 0;                   // card-id of the played market card
    @Input() CARD_TYPE: string = "";                // card-type of the played market card

    // local storage data
    gameId: number;
    numberOfPlayers: number;

    // component fields
    temple: BuildingSite;
    templeId: number;
    topLayer5: Stone[] = [];         // top stone layer 5 players
    secondLayer5: Stone[] = [];      // layer below top layer 5 players
    topLayer4: Stone[] = [];         // top stone layer 4 players
    secondLayer4: Stone[] = [];      // layer below top layer 4 players
    changedStones: boolean[] = [];   // array to keep track of changed stones;
    hasShipDocked: boolean = false;

    showPopUp: boolean = false;

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

                    // set the ID of the temple
                    this.templeId = BuildingSite.id;

                    // update local data if the building site has any stones
                    if(temple.stones.length >0){
                        this.updateData(temple);
                    }
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
                // set change to true if the ids of the currently looked at stones are not the same
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

            // update harbor
            this.hasShipDocked = temple.docked;
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

    // arrange the top two layers of stones to be displayed
    arrangeTempleStones(stones: Stone[]): Stone[] {
        let topLayerStones = stones.length;
        // if 2 players
        if (this.numberOfPlayers < 3) {
            // if there is even a second layer
            if(stones.length >4){
                // calculate how many stones are in the top layer
                topLayerStones = stones.length%4;

                // if top layer if full, set to 4 stones
                if(topLayerStones == 0){
                    topLayerStones = 4;
                }

                // temporary second layer of stones
                let secondLayer = [];
                // get the second layer stones
                for(var i=0; i<stones.length-topLayerStones;i++){
                    let index = i % 4;
                    secondLayer.splice(index, 1);
                    secondLayer.splice(index, 0, stones[i]);
                }
                // assign to secondLayer
                this.secondLayer4 = secondLayer;
            }


            // temporary top layer of stones
            let temp = [];
            // get the top layer stones
            for (let i = stones.length-topLayerStones; i < stones.length; i++) {
                let index = i % 4;
                temp.splice(index, 1);
                temp.splice(index, 0, stones[i]);
            }
            return temp;


        } else { // if more than 2 players
            // if there is even a second layer
            if(stones.length>5){
                // calculate how many stones are in the top layer
                topLayerStones = stones.length%5;

                // if top layer if full, set to 5 stones
                if(topLayerStones == 0){
                    topLayerStones = 5;
                }
                // temporary second layer of stones
                let secondLayer = [];
                // get the second layer stones
                for(var i=0; i<stones.length-topLayerStones;i++){
                    let index = i % 5;
                    secondLayer.splice(index, 1);
                    secondLayer.splice(index, 0, stones[i]);
                }
                // assign to secondLayer
                this.secondLayer5 = secondLayer;
            }
            // temporary top layer of stones
            let temp = [];
            // get the top layer stones
            for (let i = stones.length-topLayerStones; i < stones.length; i++) {
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

}
