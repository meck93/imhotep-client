import {Component, OnInit, Input} from '@angular/core';

// polling
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
    private timeoutInterval: number = 2000;

    // inputs
    @Input() ID: number;        // id to determine which ship to show (1-4)

    // local storage data
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
        this.userColor = player.playerColor;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        let gameId = game.id;

        // get current round number
        let roundNumber = game.roundCounter;
        // TODO: remove following line (use polling/ local storage)
        roundNumber = 1;

        this.updateShip(gameId, roundNumber);

        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateShip(gameId, roundNumber);
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // TODO: don't get ships from game/rounds but from game/rounds/ships/..
    // get ship with ID set by harbor
    updateShip(gameId: number, roundNumber: number): void {
        let gameRound;
        this.shipService.getRound(gameId, roundNumber).subscribe(
            (round) => {
                gameRound = round;
                let ships = gameRound.ships;
                this.ship = ships[this.ID];

                // create divs for stones if ship is initializing
                if (this.init) {
                    this.init = false;
                    this.createShip();
                }
            });
    }

    // TODO: implement game move
    setStone(number: number) {
        if (!this.ship.hasSailed && !this.isOccupied(number)) {
            this.ship.stones[number].color = this.userColor;
        }
    }

    // TODO: implement game move
    sail() {
        this.ship.hasSailed = true;
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
            if (this.ship.stones[i] == undefined) {
                this.ship.stones[i] = new Stone();
                this.ship.stones[i].id = 0;
                this.ship.stones[i].color = '';
            }
        }

        // initialize place divs on ship
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            let place = {
                id: i.toString()
            };
            this.places.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.MIN_STONES; i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }
    }

    isOccupied(place: number) {
        return this.ship.stones[place].color != '';
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
}
