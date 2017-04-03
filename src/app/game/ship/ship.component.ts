import {Component, OnInit, Input} from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';

// temp stones as the ships of the games do not return any stones yet
const STONES: Stone[] = [
    {
        id: 1,
        color: 'BLACK'
    },
    {
        id: 2,
        color: 'WHITE'
    },
    {
        id: 3,
        color: ''
    },
    {
        id: 4,
        color: 'BLACK'
    },
    {
        id: 5,
        color: ''
    },
];

@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
    // input variable for component
    @Input() SHIP: Ship;

    // TODO: needs to be changed as soon as a player is available with its color
    userColor = 'GRAY';

    // just needed to generate stone places on the middle on the ship
    PLACES = [];

    // just needed to generate little stones in the front of the ship
    littleStones = [];

    ngOnInit() {
        // get color of player for placing stones
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let userId = user.id;
        let game = JSON.parse(localStorage.getItem('currentGame'));
        let players = game.players;
        let player;
        for (let i=0; i<players.length; i++) {
            if (players[i].id == userId) {
                player = players[i];
                break;
            }
        }
        this.userColor = player.color;

        //TODO: change back to
        //this.SHIP.stones = STONES;


        // initialize place dives on ship
        for (let i = 0; i < this.SHIP.max_STONES; i++) {
            let place = {
                id: i.toString()
            };
            this.PLACES.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.SHIP.min_STONE; i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }
    }

    setStone(number: number) {
        if (!this.SHIP.hasSailed && !this.isOccupied(number)) {
            this.placeStone(this.userColor, number);
        }
    }

    sail() {
        this.SHIP.hasSailed = true;
    }

    placeStone(color: string, place: number) {
        this.SHIP.stones[place].color = color;
    }

    isOccupied(place: number) {
        return this.SHIP.stones[place].color != '';
    }

    isReadyToSail() {
        let numberOfStones = 0;
        for (let i = 0; i < this.SHIP.max_STONES; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }

        return numberOfStones >= this.SHIP.min_STONE;
    }
}
