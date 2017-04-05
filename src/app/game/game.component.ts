import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/services/user/user.service';
import {User} from '../shared/models/user';
import {Game} from '../shared/models/game';
import {Round} from '../shared/models/round';
import {GameService} from '../shared/services/game/game.service';

import {Player} from "../shared/models/player";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameService]
})
export class GameComponent  implements OnInit {
  users: User[] = [];
  game:Game;

  constructor(private gameService:GameService, private userService: UserService) { }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('currentGame'));

    // get users from secure api end point
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  createDummyStones():void{
    this.gameService.createDummyStones(this.game.id)
        .subscribe(string => {
        })
  }
}
