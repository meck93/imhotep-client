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

    game: Game; // current game
    obelisk: BuildingSite;
    stones: Stone[];
    stone: Stone;
    PLACES=[];
    placedStones=[2,4,5,2];

    private timoutInterval: number = 3000;
    private timoutId: Timer;


    constructor(private obeliskService: ObeliskService) {
    }

  
  ngOnInit() {

    
        //console.log("in Game Screen");
        this.game = JSON.parse(localStorage.getItem('currentGame'));
        this.updateObeliskStones();

        /*POLLING*/
        var that = this;
        this.timoutId = setInterval(function () {
            that.updateObeliskStones();
        }, this.timoutInterval)
  }
  addStones(stones: Stone[]): void {
        let tempArray: Stone[] = [];
    
            tempArray.push(this.stone);
        }

    updateObeliskStones(): void {
        this.obeliskService.updateObeliskStones(this.game.id)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    this.obelisk = BuildingSite;
                    this.addStones(this.obelisk.stones);
                } else {
                    console.log("no games found");
                }
            })
    }

  

}
