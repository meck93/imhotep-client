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

  game:Game;
  stones:Stone[] = MOCKSTONES;
  topLayer5:Stone[] = [];
  topLayer:Stone[] = [];

  constructor(private templeService: TempleService) { }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('currentGame'));
    this.arrangeTempleStones(this.stones);

  }

  displayRule():void{
    console.log("I rule!");
    var popup = document.getElementById("templePopup");
    popup.classList.toggle("show");
  }

  arrangeTempleStones(stones:Stone[]):void{
    if(this.game.numberOfPlayers < 3){
      for(var i=0; i<stones.length; i++){
        var index = i%4;
        this.topLayer.splice(index,1);
        this.topLayer.splice(index,0, stones[i]);
      }
    }else{
      for(var i=0; i<stones.length; i++){
        var index = i%5;
        this.topLayer5.splice(index,1);
        this.topLayer5.splice(index,0, stones[i]);
      }
    }
  }

}
