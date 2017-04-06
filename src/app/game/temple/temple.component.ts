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

  game:Game; //current game.old
  temple: BuildingSite;
  stones: Stone[];
  topLayer5:Stone[] = []; //top stone layer 5 players
  topLayer4:Stone[] = []; //top stone layer 4 players

  private timoutInterval: number = 3000;
  private timoutId: Timer;

  constructor(private templeService: TempleService) { }

  ngOnInit() {
    // get current game.old from local storage
    this.game = JSON.parse(localStorage.getItem('currentGame'));
    // get current temple stones from the server
    this.updateTempleStones();

    /*POLLING*/
    var that = this;
    this.timoutId = setInterval(function () {
      that.updateTempleStones();
    }, this.timoutInterval)
  }

  // display the rule popup
  displayRule():void{
    console.log("I rule!");
    var popup = document.getElementById("templePopup");
    popup.classList.toggle("show");
  }

  // arrange the top layer stones to be displayed
  arrangeTempleStones(stones:Stone[]):void{
    // if 2 players
    if(this.game.numberOfPlayers < 3){
      for(var i=0; i<stones.length; i++){
        var index = i%4;
        this.topLayer4.splice(index,1);
        this.topLayer4.splice(index,0, stones[i]);
      }
    }else{ // if more than 2 players
      for(var i=0; i<stones.length; i++){
        var index = i%5;
        this.topLayer5.splice(index,1);
        this.topLayer5.splice(index,0, stones[i]);
      }
    }
  }

  // get current stones from the server
  updateTempleStones():void{
    //console.log("updating burial chamber");
    this.templeService.updateTempleStones(this.game.id)
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
