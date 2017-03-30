import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {User} from '../shared/models/user';
import {Game} from '../shared/models/game';
import {BasicShip} from '../shared/models/basicShip';
import {MOCKSHIPS} from '../shared/models/mock-ships';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent  implements OnInit {
  users: User[] = [];
  dummyShips: BasicShip[];
  game:Game;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // get users from secure api end point
    this.game = JSON.parse(localStorage.getItem('currentGame'));
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });

    // load dummy/mock ships from model folder
    // TODO: get ships via polling of the game from the server
    this.dummyShips = MOCKSHIPS;
  }
}
