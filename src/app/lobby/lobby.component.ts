import {Component, OnInit} from '@angular/core';
import {Game} from '../shared/models/game';
import {GameService} from "../shared/services/game.service";
import {User} from "../shared/models/user";
import Timer = NodeJS.Timer;

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
    providers: [GameService],
})
export class LobbyComponent implements OnInit {
    games: Game[];
    user: User;
    game: Game;

    private timoutInterval: number = 10000;
    private timoutId: Timer;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        // get available games
        this.getGames();

        // get current logged in user
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        var that = this;
        this.timoutId = setInterval(function () {
            that.getGames();
        }, this.timoutInterval)
    }

    ngOnDestrory(): void {
        clearInterval(this.timoutId);
    }

    // get list of games
    getGames(): void {
        //this.gameService.getGames().then(games => this.games = games);
        this.gameService.getGames()
            .subscribe(games => {
                this.games = games;
            })
    }

    // check whether user may join a game
    isJoinable(status: String): boolean {
        // check if user owns one of the games
        for (var i = 0; i < this.games.length; i++) {
            if (this.games[i].owner === this.user.username) {
                return false;
            }
        }

        // check if game is running
        if (status === 'RUNNING') {
            return false;
        }

        return true;
    }

    // check if user owns a game
    isOwner(owner: String): boolean {
        // return true if the owner (input) is this the logged in user
        return owner === this.user.username;
    }

    // check if game has enough players to start
    hasEnoughPlayers(numberOfPlayers: number) {
        let minimum = 2;

        return numberOfPlayers >= 2;
    }

    /** This function is only for demonstration. It shows the behaviour of adding a new game.
     *  Later the add(name: string) function should trigger a POST request and register
     *  a new game on the server.
     *
     * @param name the name of the newly added game
     */
    createGame(gameName: string): void {
        this.gameService.createGame(this.user, gameName)
            .subscribe(
                game => this.games.push(game)
            );
    }



}
