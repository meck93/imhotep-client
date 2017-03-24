import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
  occupied: boolean[];

  ngOnInit() {
    this.occupied = [false, false, false];
  }

  setStone(number:number) {
    this.occupied[number] = true;
  }

}
