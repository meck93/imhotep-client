import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {TempleService} from "../../shared/services/temple/temple.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Game} from '../../shared/models/game';
import {Stone} from '../../shared/models/stone';

@Component({
  selector: 'temple',
  templateUrl: './temple.component.html',
  styleUrls: ['./temple.component.css'],
  providers: [TempleService]
})

export class TempleComponent implements OnInit {
  // polling
  private timeoutId: Timer;
  private timeoutInterval: number = componentPollingIntervall;

  // local storage data
  gameId: number;
  numberOfPlayers: number;

  // component fields
  temple: BuildingSite;
  stones: Stone[];
  topLayer5:Stone[] = [];         //top stone layer 5 players
  topLayer4:Stone[] = [];         //top stone layer 4 players

  constructor(private templeService: TempleService) {

  }

  ngOnInit() {
    // get game id and number of players from local storage
    let game = JSON.parse(localStorage.getItem('game'));
    this.gameId = game.id;
    this.numberOfPlayers = game.numberOfPlayers;

    // get current temple stones from the server
    this.updateTemple();

    // polling
    let that = this;
    this.timeoutId = setInterval(function () {
      that.updateTemple();
    }, this.timeoutInterval)
  }

  // TODO: ensure component will be destroyed when changing to the winning screen
  // destroy component
  ngOnDestroy(): void {
    // kill the polling
    clearInterval(this.timeoutId);
  }

  // get current stones from the server
  updateTemple():void{
    //console.log("updating burial chamber");
    this.templeService.updateTempleStones(this.gameId)
        .subscribe(BuildingSite => {
          if (BuildingSite) {
            // updates the stones array in this component
            this.temple = BuildingSite;
            this.stones = this.temple.stones;
            this.arrangeTempleStones(this.stones);
          } else {
            console.log("no games found");
          }
        })
  }

  // *************************************************************
  // HELPER FUNCTIONS
  // *************************************************************

  // arrange the top layer stones to be displayed
  arrangeTempleStones(stones:Stone[]):void{
    // if 2 players
    if(this.numberOfPlayers < 3){
      for(let i=0; i<stones.length; i++){
        let index = i%4;
        this.topLayer4.splice(index,1);
        this.topLayer4.splice(index,0, stones[i]);
      }
    }else{ // if more than 2 players
      for(let i=0; i<stones.length; i++){
        let index = i%5;
        this.topLayer5.splice(index,1);
        this.topLayer5.splice(index,0, stones[i]);
      }
    }
  }

  // *************************************************************
  // HELPER FUNCTIONS FOR UI
  // *************************************************************

  // display the rule popup
  displayRule():void{
    let popup = document.getElementById("templePopup");
    popup.classList.toggle("show");
  }
}
