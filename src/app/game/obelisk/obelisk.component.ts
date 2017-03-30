import { Component, OnInit } from '@angular/core';
import { Obelisk } from '../../shared/models/obelisk';
import { Stone } from '../../shared/models/stone';
import { GameService } from "app/shared/services/game.service";
import {Player} from "../../shared/models/player";
import Timer = NodeJS.Timer;

@Component({
  selector: 'obelisk',
  templateUrl: './obelisk.component.html',
  styleUrls: ['./obelisk.component.css'],
  providers: [GameService]
})
export class ObeliskComponent implements OnInit {

  constructor() { }


  PLACES=[];
  placedStones=[2,4,5,2];
  hasShip: boolean;
  amountOfPlayers: number;

  private timoutInterval: number = 3000;
  private timoutId: Timer;

  
  ngOnInit() {
    
    for (let i = 0; i < 4; i++) {
            let place = {
                id: i.toString()    
            };
            this.PLACES.push(place);
        }
  }

  selectAsTarget() {
        this.hasShip = true;
    }

}
