import { Component, OnInit } from '@angular/core';
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';

@Component({
  selector: 'ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
  ship:Ship;
  occupied: boolean[];

  PLACES = [];

  ngOnInit() {
    this.ship = new Ship();
    this.ship.setMinStones(1);
    this.ship.setMaxStones(5);
    this.occupied = [false, false, false];

    for (let i = 0; i < this.ship.getMaxStones(); i++) {
      let place = {
        id:i.toString()
      };
      this.PLACES.push(place);
    }
  }

  setStone(number:number) {
    this.occupied[number] = true;
  }

}
