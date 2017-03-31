import { Component, OnInit } from '@angular/core';
import {ScoreBoardService} from '../../shared/services/score-board/score-board.service';
import { Game } from '../../shared/models/game';
import { Player } from '../../shared/models/player';

import Timer = NodeJS.Timer;

@Component({
  selector: 'score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css'],
  providers: [ScoreBoardService]
})
export class ScoreBoardComponent implements OnInit {

  game:Game;
  players: Player[];

  private timoutInterval: number = 3000;
  private timoutId: Timer;

  constructor(private scoreBoardService:ScoreBoardService) { }


  ngOnInit(): void {
    this.game = JSON.parse(localStorage.getItem('currentGame'));

    var that = this;
    this.timoutId = setInterval(function () {

      /*TODO!
      *   ADD POLLING
      *   - GET POINTS
      * */

      //updatePoints(this.game.id);

    }, this.timoutInterval)
  }

  updatePoints(gameId:number):void{

    /*TODO!
    *   Either
    *     GET Players
    *     GET whole Game
    *     GET only Points
    * */

    this.scoreBoardService.updatePoints(this.game.id)
        .subscribe(players => {
          if (players) {
            // updates the players array in this component
            this.players = players;
          } else {
            console.log("no players found");
          }
        })
  }

}
