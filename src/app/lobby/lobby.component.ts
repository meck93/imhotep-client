import { Component, OnInit } from '@angular/core';
import {Game} from '../shared/models/game';
import {GameService} from "../shared/services/game.service";


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  providers: [GameService],
})
export class LobbyComponent implements OnInit {

  title = 'Tour of Heroes';
  games: Game[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(){
    this.gameService.getGames()
        .subscribe(games => {this.games = games;})
  }
}

