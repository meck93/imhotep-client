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

    // component fields
    players: Player[];          // players of the current game

    order: string = 'points';

  constructor(private winningScreenService: WinningScreenService,
              private router: Router) { 

  }

  ngOnInit() {
        
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameName = game.name;
        this.gameId = game.id;

        this.getSummary(this.gameId);
  }

  // gets the Players and their points
    getSummary(gameId: number): void {
        this.winningScreenService.getPoints(gameId)
            .subscribe(players => {
                if (players) {
                    // updates the players array in this component
                    this.players = players;
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

}
