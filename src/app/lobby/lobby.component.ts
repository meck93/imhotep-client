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
  games: Game[];
  selectedGame: Game;

  constructor(private gameService: GameService) { }

  getGames(): void {
    this.gameService.getGames().then(games => this.games = games);
  }

  ngOnInit(): void {
    this.getGames();
  }

  checkFull(status: String): boolean {
    if (status === 'full') {
      return true;
    } else if (status === 'running') {
      return true;
    }

    return false;
  }

}

