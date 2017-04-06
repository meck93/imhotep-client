import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
import {TempleService} from "../../shared/services/temple/temple.service";
import Timer = NodeJS.Timer;


@Component({
  selector: 'temple',
  templateUrl: './temple.component.html',
  styleUrls: ['./temple.component.css'],
  providers: [TempleService]
})
export class TempleComponent implements OnInit {
  // #newWay
  gameId: number;
  numberOfPlayers: number = 0;

  temple: BuildingSite;
  stones: Stone[];
  topLayer5:Stone[] = []; //top stone layer 5 players
  topLayer4:Stone[] = []; //top stone layer 4 players

  private timeoutInterval: number = 3000;
  private timeoutId: Timer;

  constructor(private templeService: TempleService) { }

  ngOnInit() {
    // #newWay
    // get game id and number of players from local storage
    let game = JSON.parse(localStorage.getItem('game'));
    this.gameId = game.id;
    this.numberOfPlayers = game.numberOfPlayers;

    // get current temple stones from the server
    this.updateTempleStones();

    /*POLLING*/
    let that = this;
    this.timeoutId = setInterval(function () {
      that.updateTempleStones();
    }, this.timeoutInterval)
  }

  // display the rule popup
  displayRule():void{
    console.log("I rule!");
    let popup = document.getElementById("templePopup");
    popup.classList.toggle("show");
  }

  // arrange the top layer stones to be displayed
  arrangeTempleStones(stones:Stone[]):void{
    // if 2 players
    if(this.numberOfPlayers < 3){
      for(var i=0; i<stones.length; i++){
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

  // get current stones from the server
  updateTempleStones():void{
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

}
