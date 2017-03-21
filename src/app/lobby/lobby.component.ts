import { Component, OnInit } from '@angular/core';
import {Game} from '../shared/models/game';
import {GameService} from "../shared/services/game.service";
import {User} from "../shared/models/user";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  providers: [GameService],
})
export class LobbyComponent implements OnInit {

  title = 'Tour of Heroes';
  games: Game[];
  user: User;
  selectedGame: Game;

  constructor(private gameService: GameService) { }

  getGames(): void {
    this.gameService.getGames().then(games => this.games = games);
  }

  ngOnInit(): void {
    // get available games
    this.getGames();

    // get current logged in user
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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

