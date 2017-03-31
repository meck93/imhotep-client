import {Component, OnInit, Input} from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';

// temp stones as the ships of the games do not return any stones yet
const STONES:Stone[] = [
    {
        id: 1,
        color:'BLACK'
    },
    {
        id: 2,
        color:'WHITE'
    },
    {
        id: 3,
        color:''
    },
    {
        id: 4,
        color:'BLACK'
    },
    {
        id: 5,
        color:''
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
        this.ship = new Ship();
        this.ship.id = this.SHIP.id;
        this.ship.minStone = this.SHIP.minStone;
        this.ship.maxStone = this.SHIP.maxStone;
        //TODO: change back to
        //this.ship.stones = this.SHIP.stones;
        this.ship.stones = STONES;

        // initialize place dives on ship
        for (let i = 0; i < this.ship.maxStone; i++) {
            let place = {
                id: i.toString()
            };
            this.PLACES.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.minStone; i++) {
            let littleStone = {id: i.toString()};
            this.littleStones.push(littleStone);
        }
    }

    setStone(number: number) {
        if (!this.hasSailed && !this.isOccupied(number)) {
            this.placeStone(this.userColor, number);
        }
    }

    sail() {
        this.hasSailed = true;
    }

    placeStone(color:string, place:number) {
        this.ship.stones[place].color = color;
    }

    isOccupied(place:number) {
        return this.ship.stones[place].color!='';
    }

    isReadyToSail() {
        let numberOfStones = 0;
        for (let i=0; i<this.ship.maxStone; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }

        return numberOfStones >= this.ship.minStone;
    }
}
