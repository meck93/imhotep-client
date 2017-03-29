import {Component, OnInit} from '@angular/core';
import {Game} from '../shared/models/game';
import {GameService} from "../shared/services/game.service";
import {User} from "../shared/models/user";
import {UserService} from '../shared/services/user.service';
import {Player} from "../shared/models/player";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/services/authentication.service";
import Timer = NodeJS.Timer;

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
    providers: [GameService],
})
export class LobbyComponent implements OnInit {
    user: User;
    users: User[] = [];
    games: Game[];
    game: Game;
    joinedGame: Game; //the game the User joins
    joinedGameUsers: User[];
    playerID: number;

    private timoutInterval: number = 3000;
    private timoutId: Timer;

    constructor(private router: Router, private gameService: GameService, private userService: UserService, private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        // get available games
        this.getGames();
        // get current logged in user
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        // set playerID
        this.playerID = this.user.id;


        var that = this;
        this.timoutId = setInterval(function () {
            that.getGames();
            //this.checkForGames();
            that.updateJoinedGame();
            //that.updateJOinedGameUsers();
        }, this.timoutInterval)
    }

    updateJoinedGame(): void {
        //this.gameService.getGames().then(games => this.games = games);
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
        };
    }


    hasJoined(): string {
        if (this.joinedGame != undefined) {
            return "none";
        } else {
            return "";
        }
    }

    // kills the polling
    ngOnDestroy(): void {
        clearInterval(this.timoutId);
    }

    // check if there are any games to display
    hasNoGames(): boolean {
        var count = 0;
        if (this.games == undefined)return true;
        for (var i = 0; i < this.games.length; i++) {
            count++;
        }
        if (count == 0) {
            return true;
        }
        else {
            return false;
        }
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

    // log out the user
    logout(): void {
        this.authService.logout();
        this.ngOnDestroy();
        this.router.navigate(['/login']);
    }

    // get list of games
    getGames(): void {
        //this.gameService.getGames().then(games => this.games = games);
        this.gameService.getGames()
            .subscribe(games => {
                if (games) {
                    // updates the games array in this component
                    this.games = games;
                    // check if one of the games is running and whether it is the joined game
                    //this.checkIfRunning(games);
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

    changeToGameScreen(): void {
        localStorage.setItem('currentGame', JSON.stringify({
            id: this.joinedGame.id,
            name: this.joinedGame.name,
            owner: this.joinedGame.owner,
            status: this.joinedGame.status,
            currentPlayer: this.joinedGame.currentPlayer,
            players: this.joinedGame.players,
            roundCounter: this.joinedGame.roundCounter,
            amountOfPlayers: this.joinedGame.amountOfPlayers
        }));
        // deactivate polling if screen is left
        this.ngOnDestroy();
        //navigate to the game screen
        this.router.navigate(['/game']);
    }


    getPlayers(game: Game): void {
        var id = game.id;
        this.gameService.getPlayers(game)
            .subscribe(players => {
                this.joinedGame.players = players;
            })
    };

    // join an existing game
    joinGame(gameToJoin: Game): void {
        // set the selected game as the joined game
        this.joinedGame = gameToJoin;
        console.log(this.joinedGame.name);
        this.gameService.joinGame(gameToJoin, this.user)
            .subscribe(game => {
                /*TODO: handle the return! currently returns "game/{gameId}/player/{playerNr}" */
            })
    }

    // start an existing game
    startGame(game: Game): void {
        this.gameService.startGame(game, this.user.id)
            .subscribe(game => {
                //put in call to updatedGame(game.id)
                /*TODO: handle the return! It is a POST without a return*/
                ;
            })
    }

    /** This function is only for demonstration. It shows the behaviour of adding a new game.
     *  Later the add(name: string) function should trigger a POST request and register
     *  a new game on the server.
     *
     * @param name the name of the newly added game
     */
    createGame(gameName: string): void {
        this.gameService.createGame(this.user, gameName)
            .subscribe(game => {
                // et the created game as the joined game
                this.joinedGame = game;
                // debug
                console.log(this.joinedGame.name);
                this.games.push(game);
            });
    }
}
