import {Component, OnInit} from '@angular/core';
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
    games: Game[];
    user: User;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        // get available games
        this.getGames();

        // get current logged in user
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    // get list of games
    getGames(): void {
        //this.gameService.getGames().then(games => this.games = games);
       this.gameService.getGames()
        .subscribe(games => {this.games = games;})
    }

    // check whether a game is full or running
    isJoinable(status: String): boolean {
        if(status === 'RUNNING') {
            return false;
        }
        return true;
    }

    // check if user owns a game
    isOwner(owner: String): boolean {
        // return true if the owner (input) is this the logged in user
        return owner === this.user.username;
    }
}

/*

CODE FOR CHECKING IF USER OWNS A GAME WHEN LOBBY IS LOADED TO LATER DISABLE ALL JOIN BUTTONS

 // check if user owns one of the games
 for (var i = 0; i < this.games.length; i++) {
 if (this.games[i].owner === this.user.username) {
 this.isGameOwner = true;
 break;
 }
 }

// ADD THIS TO IS jOINABLE METHOD
 if (this.isGameOwner) {
 return false;
 }



 */

