import {Component, OnInit, Input} from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {BasicShip} from '../../shared/models/basicShip';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
    @Input() SHIP: BasicShip =
        {
            id: 0,
            MIN_STONES: 0,
            MAX_STONES: 0
        };

    // most of this fields and functions need to be extracted to the ship model
    ship: Ship;

    occupied: boolean[];

    numberOfPlacedStones: number = 0;
    isReadyToSail: boolean;

    hasSailed: boolean;

    PLACES = [];

    // just needed to generate little stones in the front of the ship
    littleStones = [];

    ngOnInit() {
        this.ship = new Ship(this.SHIP.id, this.SHIP.MIN_STONES, this.SHIP.MAX_STONES);
        this.occupied = [false, false, false];

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
    }

    setStone(number: number) {
        if (!this.hasSailed) {
            this.occupied[number] = true;

            this.numberOfPlacedStones = this.numberOfPlacedStones + 1;
            this.isReadyToSail = this.numberOfPlacedStones >= this.ship.getMinStones();
        }
    }

    sail() {
        this.hasSailed = true;
    }
}
