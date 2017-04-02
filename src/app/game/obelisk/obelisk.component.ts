import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
import { ObeliskService } from "app/shared/services/obelisk/obelisk.service";
import Timer = NodeJS.Timer;


@Component({
  selector: 'obelisk',
  templateUrl: './obelisk.component.html',
  styleUrls: ['./obelisk.component.css'],
  providers: [ObeliskService]
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
