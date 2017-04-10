import {Component, OnInit, ElementRef} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {AuthenticationService} from "../shared/services/authentication/authentication.service";
import {UserService} from '../shared/services/user/user.service';
import {LobbyService} from '../shared/services/lobby/lobby.service';
import {GameService} from "../shared/services/game/game.service";

// models
import {Router} from "@angular/router";
import {User} from "../shared/models/user";
import {Player} from "../shared/models/player";
import {Game} from '../shared/models/game';
import {Round} from "../shared/models/round";

@Component({
    selector: 'lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
    providers: [GameService, LobbyService],
})

export class LobbyComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;

    // component fields
    user: User;         // logged in user
    playerID: number;   // player id

    games: Game[];      // list of all games
    newGame: Game;      // new game to create
    joinedGame: Game;   // the game the user joined

    constructor(private router: Router,
                private gameService: GameService,
                private lobbyService: LobbyService,
                private userService: UserService,
                private authService: AuthenticationService,
                private myElement: ElementRef) {
    }

    // initialize component
    ngOnInit(): void {
        // get current logged in user from local storage
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        // set playerID
        this.playerID = this.user.id;

        // initialize game so that the user can create a new game
        this.newGame = new Game();

        // polling
        this.getGames();    // get available games from te server

        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateLobby();
        }, this.timeoutInterval)
    }

    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    updateLobby() {
        // get all games from the server
        this.getGames();

        // update the local joined game of the logged in user
        this.updateJoinedGame();
    }

    // get list of all games
    getGames(): void {
        this.gameService.getGames()
            .subscribe(games => {
                if (games) {
                    // updates the games array in this component
                    this.games = games;

                    // if user joined a game check whether it is running or not and redirect to game screen if it is running
                    if (this.joinedGame != undefined) {
                        if (this.joinedGame.status == "RUNNING") {
                            this.changeToGameScreen();
                        }
                    }
                } else {
                    console.log("no games found");
                }
            })
    };

    // create a new game
    createGame(): void {
        // only allow game names of specified length
        if (this.newGame.name.length > 15) {
            alert("The game name must have less than 15 characters");
            return;
        }

        // create game
        this.lobbyService.createGame(this.user, this.newGame.name)
            .subscribe(game => {
                // get the created game as the joined game
                this.joinedGame = game;
                console.log(game);

                // show created game immediately in the games table
                this.games.push(game);
            });
    }

    // join an existing game
    joinGame(gameToJoin: Game): void {
        this.lobbyService.joinGame(gameToJoin, this.user)
            .subscribe(game => {
                /*TODO: handle the return! currently returns "game/{gameId}/player/{playerNr}" */
            });
        // set the selected game as the joined game
        this.joinedGame = gameToJoin;
    }

    // update joined game
    updateJoinedGame(): void {
        if (this.joinedGame != undefined) {
            this.gameService.getGame(this.joinedGame)
                .subscribe(game => {
                    if (game) {
                        // updates the games array in this component
                        this.joinedGame = game;

                    } else {
                        console.log("no games found");
                    }
                })
        }
    }

    // start an existing game
    startGame(game: Game): void {
        this.lobbyService.startGame(game, this.user.id)
            .subscribe(game => {
                //put in call to updatedGame(game.id)
                /*TODO: handle the return! It is a POST without a return*/
            })
    }

    // change to game screen
    changeToGameScreen(): void {
        this.saveGameVariables(this.joinedGame);
        this.savePlayerNumber(this.joinedGame);

        // deactivate polling if screen is left
        this.ngOnDestroy();
        //navigate to the game screen
        this.router.navigate(['/game']);
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    saveGameVariables(game: Game) {
        // get players of game
        let originalPlayers = game.players;

        // get information about every player
        let players = [];
        for (let i = 0; i < originalPlayers.length; i++) {
            let player = {
                id: 0,
                username: '',
                color: '',
                playerNumber: 0
            };

            player.id = originalPlayers[i].id;
            player.username = originalPlayers[i].username;
            player.color = originalPlayers[i].color;
            player.playerNumber = originalPlayers[i].playerNumber;

            players.push(player);
        }

        // save information about joined game to local storage
        // NOTE: only save information that wont be changed during the game!
        localStorage.setItem('game', JSON.stringify({
            id: game.id,
            numberOfPlayers: game.numberOfPlayers,
            players: players,
            name: game.name
        }));
    }

    savePlayerNumber(game: Game) {
        // get user id from local storage
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let userId = user.id;

        // get players of game
        let players = game.players;

        // find player of corresponding user
        let player;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == userId) {
                player = players[i];
                break;
            }
        }

        // save player number and color to local storage
        localStorage.setItem('player', JSON.stringify({
            number: player.playerNumber,
            color: player.color
        }));
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // check whether the input field for the game name is empty or not
    isGameNameEmpty() {
        return this.myElement.nativeElement.querySelector('#gameCreation').value == "";
    }

    hasJoined(): string {
        if (this.joinedGame != undefined) {
            return "none";
        } else {
            return "";
        }
    }

    // check if there are any games to display
    hasNoGames(): boolean {
        let count = 0;
        if (this.games == undefined)return true;
        for (let i = 0; i < this.games.length; i++) {
            count++;
        }

        return count == 0;
    }

    // check whether user may join a game
    isJoinable(status: String): boolean {
        // check if user owns one of the games
        for (let i = 0; i < this.games.length; i++) {
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

    // log out the user
    logout(): void {
        this.authService.logout();
        this.ngOnDestroy();
        this.router.navigate(['/login']);
    }


    getPlayers(game: Game): void {
        var id = game.id;
        this.gameService.getPlayers(game)
            .subscribe(players => {
                this.joinedGame.players = players;
            })
    };
}
