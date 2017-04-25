import { Component, OnInit } from '@angular/core';

// services
import {WinningScreenService} from '../shared/services/winning-screen/winning-screen.service';

// models
import {Router} from "@angular/router";
import {Player} from '../shared/models/player';
import { Game } from '../shared/models/game';
import { User } from "app/shared/models/user";

@Component({
  selector: 'app-winning-screen',
  templateUrl: './winning-screen.component.html',
  styleUrls: ['./winning-screen.component.css'],
  providers: [WinningScreenService]
})
export class WinningScreenComponent implements OnInit {

    // local storage data
    game: Game;
    player: Player;
    gameId: number;
    gameName: string;            // name of current game
    numberOfPlayers: number
    errorMessage: string;

    // component fields
    players: Player[] =[];          // players of the current game

  constructor(private winningScreenService: WinningScreenService,
              private router: Router) {

  }

  ngOnInit() {

        // get game id from local storage
        this.game = JSON.parse(localStorage.getItem('game'));
        this.gameName = this.game.name;
        this.gameId = this.game.id;
        this.numberOfPlayers = this.game.numberOfPlayers;

        // get current logged in user from local storage
        this.player = JSON.parse(localStorage.getItem('currentUser'));

        this.getSummary(this.gameId);
  }

  // gets the Players and their points
    getSummary(gameId: number): void {
        this.winningScreenService.getPoints(gameId)
            .subscribe(players => {
                if (players) {
                    // updates the players array in this component
                    this.players = players;
                    this.getWinner(this.players);

                } else {
                    console.log("no players found");
                }
            })

    }

    // orders the players array in descending order according to the total number of points
    getWinner(players: Player[]){

        let tempPlayer: Player;

        for(let i=0; i< players.length -1; i++){
          for(let j=1; j<players.length -i; j++){
            if(players[j-1].points[5]<players[j].points[5]){
              tempPlayer = players[j-1];
              players[j-1] = players[j];
              players[j] = tempPlayer;

            }

          }

        }
    }


    // delete game and navigate back to lobby
    deleteGame(game: Game): void {
        this.winningScreenService.deleteGame(game, this.player)
            .subscribe(game => {
                console.log(game);
                /*TODO: handle the return! It is a POST without a return*/
            },error =>  this.errorMessage = <any>error);

            this.router.navigate(['/lobby'])
    }


}
