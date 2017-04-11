import {Component, OnInit, Input} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ShipService} from '../../shared/services/ship/ship.service';
import {MoveService} from '../../shared/services/move/move.service';
import {SupplySledService} from '../../shared/services/supply-sled/supply-sled.service';

// models
import {Game} from '../../shared/models/game';
import {Round} from '../../shared/models/Round';
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';

// others
import {isNullOrUndefined} from "util";

@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css'],
    providers: [ShipService, MoveService, SupplySledService]
})

// ship only works if every place is filled (as it is not able to handle empty spaces)
// also load dummy data to ship!!!!
export class ShipComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() ID: number;        // id to determine which ship to show
    @Input() ROUND: number;     // the current round of the game
    @Input() CURRENTPLAYER: number;

    // local storage data
    gameId: number;
    playerNumber: number;
    userColor: string;          // color of this player

    // component fields
    ship: Ship;                 // ship with data
    places = [];                // just needed to generate stone places on the middle on the ship
    littleStones = [];          // just needed to generate little stones in the front of the ship
    init: boolean = true;       // boolean to later create all ship spaces for the stones
    stones: Stone[] = [];       // the stones of this ship

    hasSupplySledStones: boolean;

    constructor(private shipService: ShipService, private moveService: MoveService, private supplySledService: SupplySledService) {

    }

    // initialize component
    ngOnInit() {
        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.playerNumber = player.number;
        this.userColor = player.playerColor;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        this.updateShip(this.gameId, this.ROUND, this.ID);

        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateShip(that.gameId, that.ROUND, that.ID);
            that.updateSupplySled();
        }, this.timeoutInterval);
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // get ship with ID set by harbor
    updateShip(gameId: number, roundNumber: number, shipId: number): void {
        if (roundNumber != 0) {
            this.shipService.getShip(gameId, roundNumber, shipId).subscribe(
                (ship) => {
                    this.ship = ship;

                    // init stone array
                    //this.stones = [this.ship.MAX_STONES];

                    for (let i=0; i<this.ship.MAX_STONES; i++) {
                        this.stones.push(undefined);
                    }

                    this.stones= [undefined, undefined, undefined];

                    // get number of stones placed on the ship
                    let numberOfStones = this.ship.stones.length;

                    // place stones form received ship to local array
                    for (let i=0; i<numberOfStones; i++) {
                        this.stones[this.ship.stones[i].placeOnShip - 1] = this.ship.stones[i];
                    }


/*
                    // TODO: remove, as soon as ship has stones
                    let max = this.ship.MAX_STONES;
                    for (let i = 0; i < max; i++) {
                        if (this.ship.stones[i]) {

                        }
                        let stone: Stone = new Stone();
                        stone.id = 0;
                        stone.color = '';
                        this.ship.stones.push(stone);
                    }
*/

                    // create divs for stones if ship is initializing
                    if (this.init) {
                        this.init = false;
                        this.createShip();
                    }
                });
        }
    }

    updateSupplySled(): void {
        this.supplySledService.updateSupplySledStones(this.gameId, this.playerNumber)
            .subscribe(playerData => {
                if (playerData) {
                    // check if there are stones on the sled
                    this.hasSupplySledStones = playerData.supplySled.stones.length > 0;
                } else {
                    console.log("supply sled data error");
                }
            })
    }

    // TODO: implement game move
    setStone(number: number) {
        if (this.isMyTurn() && !this.ship.hasSailed && !this.isOccupied(number)) {
            //this.ship.stones[number].color = this.userColor;

            number++;

            this.moveService.placeStone(this.gameId, this.ROUND, this.playerNumber, this.ID, number)
                .subscribe(response => {
                    //TODO: catch error of request response
                    console.log(response);
                });
        }

        console.log("player: " + this.playerNumber);
        console.log("ship: " + this.ID);
        console.log("place: " + number);
    }

    // TODO: implement game move
    sail() {
        if (this.isMyTurn()) {
            this.ship.hasSailed = true;
        }
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // create divs for stones
    createShip() {
/*
        // workaround for undefined stones
        // TODO: remove later on
        let max = this.ship.MAX_STONES;
        for (let i = 0; i < max; i++) {
            //if (this.ship.stones[i] == undefined) {
                let stone: Stone = new Stone();
                stone.id = 0;
                stone.color = '';
                this.ship.stones.push(stone);
            //}
        }
*/
        //console.log("Stones:");
        //console.log(this.ship.stones);

        // initialize place divs on ship
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            let place = {id: i};
            this.places.push(place);
        }
        //console.log("Places:");
        //console.log(this.places);

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.MIN_STONES; i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }
    }

    // TODO: remove if, only for testing
    isOccupied(place: number) {
        if (!this.init && this.stones[place] != undefined) {
            return this.stones[place].color != '';
        } else {
            //console.log("ship: " + this.ID);
            //console.log("place: " + place);
            //console.log("stones: ");
            //console.log(this.ship.stones);

            //console.log(this.ship.stones[place]);
        }

        return false;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    isReadyToSail() {
        let numberOfStones = 0;
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }
        return numberOfStones >= this.ship.MIN_STONES;
    }

    isMyTurn() {
        // checks whether the current player and the player number of this client are the same
        return this.playerNumber==this.CURRENTPLAYER;

    }
}