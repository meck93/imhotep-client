import {Component, OnInit, Input} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ShipService} from '../../shared/services/ship/ship.service';

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
    providers: [ShipService]
})

// ship only works if every place is filled (as it is not able to handle empty spaces)
// also load dummy data to ship!!!!
export class ShipComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() ID: number;        // id to determine which ship to show (1-4)
    @Input() ROUND: number;     // the current round of the game
    @Input() CURRENTPLAYER: number;

    // local storage data
    playerNumber: number;
    userColor: string;          // color of this player

    // component fields
    ship: Ship;                 // ship with data
    places = [];                // just needed to generate stone places on the middle on the ship
    littleStones = [];          // just needed to generate little stones in the front of the ship
    init: boolean = true;       // boolean to later create all ship spaces for the stones

    constructor(private shipService: ShipService) {

    }

    // initialize component
    ngOnInit() {
        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.playerNumber = player.number;
        this.userColor = player.playerColor;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        let gameId = game.id;

        this.updateShip(gameId, this.ROUND, this.ID);

        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateShip(gameId, that.ROUND, that.ID);
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

                    // TODO: remove, as soon as ship has stones
                    let max = this.ship.MAX_STONES;
                    for (let i = 0; i < max; i++) {
                        let stone: Stone = new Stone();
                        stone.id = 0;
                        stone.color = '';
                        this.ship.stones.push(stone);
                    }

                    // create divs for stones if ship is initializing
                    if (this.init) {
                        this.init = false;
                        this.createShip();
                    }
                });
        }
    }

    // TODO: implement game move
    setStone(number: number) {
        if (this.isMyTurn() && !this.ship.hasSailed && !this.isOccupied(number)) {
            this.ship.stones[number].color = this.userColor;
        }
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
        if (!this.init && this.ship.stones[place] != undefined) {
            return this.ship.stones[place].color != '';
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