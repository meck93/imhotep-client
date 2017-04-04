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
    
    whiteStoneCounter:number = 0;
    blackStoneCounter:number = 0;
    grayStoneCounter:number = 0;
    brownStoneCounter:number = 0;

    points = [this.whiteStoneCounter,this.blackStoneCounter,this.grayStoneCounter,this.brownStoneCounter];

    maxValue:number = 0;

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

  amountOfPlayers():number{
      return this.game.numberOfPlayers;
  }

  displayRule():void{
        console.log("I rule!");
        var popup = document.getElementById("obeliskPopup");
        popup.classList.toggle("show");
    }

  addStones(stones: Stone[]): void {
      let white = 0;
      let black = 0;
      let gray = 0;
      let brown = 0;
      for(var i = 0; i<stones.length; i++){
          if(stones[i].color == 'WHITE'){
              white++;
          }
          if(stones[i].color == 'BLACK'){
              black++;
          }
          if(stones[i].color == 'GRAY'){
              gray++;
          }
          if(stones[i].color == 'BROWN'){
              brown++;
          }
      }
      this.whiteStoneCounter = white;
      this.blackStoneCounter = black;
      this.grayStoneCounter = gray;
      this.brownStoneCounter = brown;
  }

  findMaxValue(){
     let largest = this.points[0];
     for(var i = 0; i< this.points.length; i++){
         if(this.points[i]>largest){
             largest = this.points[i];
         }
     }
     this.maxValue = largest;
  }




       

    updateObeliskStones(): void {
        this.obeliskService.updateObeliskStones(this.game.id)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    this.obelisk = BuildingSite;
                    console.log(this.obelisk.stones);
                    this.addStones(this.obelisk.stones);
                    this.points = [this.whiteStoneCounter,this.blackStoneCounter,this.grayStoneCounter,this.brownStoneCounter];
                    this.findMaxValue();
                } else {
                    console.log("no games found");
                }
            })
    }

  

}
