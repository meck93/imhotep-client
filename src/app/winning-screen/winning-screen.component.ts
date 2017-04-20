import { Component, OnInit } from '@angular/core';

// services
import {WinningScreenService} from '../shared/services/winning-screen/winning-screen.service';

// models
import {Router} from "@angular/router";
import {Player} from '../shared/models/player';
import {Game} from '../shared/models/game';

@Component({
  selector: 'app-winning-screen',
  templateUrl: './winning-screen.component.html',
  styleUrls: ['./winning-screen.component.css'],
  providers: [WinningScreenService]
})
export class WinningScreenComponent implements OnInit {

    // local storage data
    gameId: number;
    gameName: string;            // name of current game
    winner: string;             // name of winner
    numberOfPlayers: number;

    // component fields
    players: Player[] =[];          // players of the current game

    sumPoints: number[] = []; // array to store summarized points for each player


  constructor(private winningScreenService: WinningScreenService,
              private router: Router) {

  }

  ngOnInit() {

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameName = game.name;
        this.gameId = game.id;
        this.numberOfPlayers = game.numberOfPlayers;

        // initialize variables that are dependent from amount of players
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.sumPoints.push(0);
        }

        this.getSummary(this.gameId);
  }

  // gets the Players and their points
    getSummary(gameId: number): void {
        this.winningScreenService.getPoints(gameId)
            .subscribe(players => {
                if (players) {
                    // updates the players array in this component
                    this.players = players;
                    this.summarizePoints(this.players);
                    this.getWinner(this.players);

                } else {
                    console.log("no players found");
                }
            })

    }

    ngOnDestroy(): void {
    }

    changeToLobbyScreen(): void {
        this.ngOnDestroy();
        //navigate back to the lobby
        this.router.navigate(['/lobby']);
    }

    // calculates the total sum of points for each player
    summarizePoints(players: Player[]){
        for(let i=0; i<players.length; i++){
            switch (players[i].color){
                case 'BLACK':
                    for(let j=0; j<players[i].points.length; j++){
                        this.sumPoints[0] += players[i].points[j];
                    }
                    break;
                case 'WHITE':
                    for(let j=0; j<players[i].points.length; j++){
                        this.sumPoints[1] += players[i].points[j];
                    }
                    break;
                case 'BROWN':
                    for(let j=0; j<players[i].points.length; j++){
                        this.sumPoints[2] += players[i].points[j];
                    }
                    break;
                case 'GRAY':
                    for(let j=0; j<players[i].points.length; j++){
                        this.sumPoints[3] += players[i].points[j];
                    }
                    break;

            }
        }

    }

    // gets the player with the highest amount of points
    getWinner(players: Player[]){

        let tempWinner = players[0];

        for(let i=0; i< players.length; i++){
          if(tempWinner.points[5] < players[i].points[5]){
            tempWinner = players[i];
          }
        }

        this.winner = tempWinner.username;
    }

}
