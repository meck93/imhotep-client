import {Component, OnInit, Input} from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {BasicShip} from '../../shared/models/basicShip';

@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
    // input variable for component
    @Input() SHIP: BasicShip =
        {
            id: 0,
            MIN_STONES: 0,
            MAX_STONES: 0,
            stones: [{id: 0, color: ''}]
        };

    // ship of the component that holds stones and provides all functions (see ship model)
    ship: Ship;

    // TODO: needs to be changed as soon as a player is available with its color
    userColor = 'GRAY';

    hasSailed: boolean;

    // just needed to generate stone places on the middle on the ship
    PLACES = [];

    // just needed to generate little stones in the front of the ship
    littleStones = [];

    ngOnInit() {
        this.ship = new Ship(this.SHIP.id, this.SHIP.MIN_STONES, this.SHIP.MAX_STONES, this.SHIP.stones);

        // initialize place dives on ship
        for (let i = 0; i < this.ship.getMaxStones(); i++) {
            let place = {
                id: i.toString()
            };
            this.PLACES.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.getMinStones(); i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }

        this.game = JSON.parse(localStorage.getItem('currentGame'));
    }

    setStone(number: number) {
        if (!this.hasSailed && !this.ship.isOccupied(number)) {
            this.ship.placeStone(this.userColor, number);
        }
    }

    sail() {
        this.hasSailed = true;
    }
}
