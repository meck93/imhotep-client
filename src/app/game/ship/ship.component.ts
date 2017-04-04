import {Component, OnInit, Input} from '@angular/core';
import {ShipService} from '../../shared/services/ship/ship.service';
import {Game} from '../../shared/models/game';
import {Round} from '../../shared/models/Round';
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';

import Timer = NodeJS.Timer;
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
    // fields for polling
    private timeoutInterval: number = 2000;
    private timeoutId: Timer;

    // id to determine which ship to show (1-4)
    @Input() ID: number;

    // ship with data
    ship: Ship;

    // color of this player
    userColor: string;

    // just needed to generate stone places on the middle on the ship
    places = [];

    // just needed to generate little stones in the front of the ship
    littleStones = [];

    // boolean to later create all ship spaces for the stones
    init: boolean = true;

    constructor(private shipService: ShipService) {
    }

    ngOnInit() {
        // get user id
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let userId = user.id;

        // get players of game
        let game = JSON.parse(localStorage.getItem('currentGame'));
        let players = game.players;

        // find color of this player
        let player;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == userId) {
                player = players[i];
                break;
            }
        }
        this.userColor = player.color;

        // get current round number
        let gameId = game.id;
        let roundNumber = game.roundCounter;
        // TODO: remove following line (fix, as roundCounter does not work in 'game')
        roundNumber = 1;

        this.getShip(gameId, roundNumber);

        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.getShip(gameId, roundNumber);
        }, this.timeoutInterval)
    }

    setStone(number: number) {
        if (!this.ship.hasSailed && !this.isOccupied(number)) {
            this.placeStone(this.userColor, number);
        }
    }

    sail() {
        // TODO: implement game move
        this.ship.hasSailed = true;
    }

    placeStone(color: string, place: number) {
        // TODO: implement game move
        this.ship.stones[place].color = color;
    }

    isOccupied(place: number) {
        return this.ship.stones[place].color != '';
    }

    isReadyToSail() {
        let numberOfStones = 0;
        for (let i = 0; i < this.ship.max_STONES; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }

        return numberOfStones >= this.ship.min_STONE;
    }

    // get ship with ID set by harbor
    // TODO: don't get ships from game/rounds but from game/rounds/ships/..
    getShip(gameId: number, roundNumber: number): void {
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

    // create divs for stones
    createShip() {
        // workaround for undefined stones
        // TODO: remove later on
        let max = this.ship.max_STONES;
        for (let i=0; i<max; i++) {
            if (this.ship.stones[i] == undefined) {
                this.ship.stones[i] = new Stone();
                this.ship.stones[i].id = 0;
                this.ship.stones[i].color = '';
            }
        }
        
        // initialize place divs on ship
        for (let i = 0; i < this.ship.max_STONES; i++) {
            let place = {
                id: i.toString()
            };
            this.places.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.min_STONE; i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }
    }
}
