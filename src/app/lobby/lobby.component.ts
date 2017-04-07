import {Component, OnInit, ElementRef} from '@angular/core';

// polling
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
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
    providers: [GameService, LobbyService],
})

export class LobbyComponent implements OnInit {
    private timeoutId: Timer;
    private timeoutInterval: number = 3000;

    // new way
    gameId: number;

    user: User;
    games: Game[];
    game: Game;
    newGame: Game;
    joinedGame: Game; //the game the User joins
    playerID: number;
    firstLogin: boolean = true;


    constructor(private router: Router,
                private gameService: GameService,
                private lobbyService: LobbyService,
                private userService: UserService,
                private authService: AuthenticationService,
                private myElement: ElementRef) {
    }

    // initialize component
    ngOnInit(): void {
        this.newGame = new Game();
        // get available games
        this.getGames();
        // get current logged in user
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        // set playerID
        this.playerID = this.user.id;
        this.joinedGame = JSON.parse(localStorage.getItem('joinedGame'));


        let that = this;
        this.timeoutId = setInterval(function () {
            //get all games from the server
            that.getGames();

            //update the local joined game of the logged in user
            that.updateJoinedGame();

            this.joinedGame = JSON.parse(localStorage.getItem('joinedGame'));
            //this.checkForGames();

            //that.updateJOinedGameUsers();

        }, this.timeoutInterval)
    }

    // destroy component
    ngOnDestroy(): void {
        // kills the polling
        clearInterval(this.timeoutId);
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

    // create a new game
    createGame(): void {
        if (this.newGame.name.length > 15) {
            alert("The game name must have less than 15 characters");
            return;
        }
        this.lobbyService.createGame(this.user, this.newGame.name)
            .subscribe(game => {
                // get the created game as the joined game
                this.joinedGame = game;
                localStorage.removeItem('joinedGame');
                localStorage.setItem('joinedGame', JSON.stringify({
                    id: this.joinedGame.id,
                    name: this.joinedGame.name,
                    owner: this.joinedGame.owner,
                    status: this.joinedGame.status,
                    currentPlayer: this.joinedGame.currentPlayer,
                    roundCounter: this.joinedGame.roundCounter,
                    obelisk: this.joinedGame.obelisk,
                    burialChamber: this.joinedGame.burialChamber,
                    pyramid: this.joinedGame.pyramid,
                    temple: this.joinedGame.temple,
                    numberOfPlayers: this.joinedGame.numberOfPlayers,
                    marketPlace: this.joinedGame.marketPlace,
                    stoneQuarry: this.joinedGame.stoneQuarry,
                    rounds: this.joinedGame.rounds,
                    players: this.joinedGame.players
                }));
                // debug
                this.games.push(game);
            });
    }

    // join an existing game
    joinGame(gameToJoin: Game): void {
        this.lobbyService.joinGame(gameToJoin, this.user)
            .subscribe(game => {
                /*TODO: handle the return! currently returns "game/{gameId}/player/{playerNr}" */
            })
        // set the selected game as the joined game
        this.joinedGame = gameToJoin;
        localStorage.removeItem('joinedGame');
        localStorage.setItem('joinedGame', JSON.stringify({
            id: this.joinedGame.id,
            name: this.joinedGame.name,
            owner: this.joinedGame.owner,
            status: this.joinedGame.status,
            currentPlayer: this.joinedGame.currentPlayer,
            roundCounter: this.joinedGame.roundCounter,
            obelisk: this.joinedGame.obelisk,
            burialChamber: this.joinedGame.burialChamber,
            pyramid: this.joinedGame.pyramid,
            temple: this.joinedGame.temple,
            numberOfPlayers: this.joinedGame.numberOfPlayers,
            marketPlace: this.joinedGame.marketPlace,
            stoneQuarry: this.joinedGame.stoneQuarry,
            rounds: this.joinedGame.rounds,
            players: this.joinedGame.players
        }));
    }

    // update joined game
    updateJoinedGame(): void {
        //this.gameService.getGames().then(games => this.games = games);
        if (this.joinedGame != undefined) {
            console.log("You are in Game# " + this.joinedGame.id);
            console.log("You have ID# " + this.user.id);
            this.gameService.getGame(this.joinedGame)
                .subscribe(game => {
                    if (game) {
                        // updates the games array in this component
                        this.joinedGame = game;
                        localStorage.removeItem('joinedGame');
                        localStorage.setItem('joinedGame', JSON.stringify({
                            id: this.joinedGame.id,
                            name: this.joinedGame.name,
                            owner: this.joinedGame.owner,
                            status: this.joinedGame.status,
                            currentPlayer: this.joinedGame.currentPlayer,
                            roundCounter: this.joinedGame.roundCounter,
                            obelisk: this.joinedGame.obelisk,
                            burialChamber: this.joinedGame.burialChamber,
                            pyramid: this.joinedGame.pyramid,
                            temple: this.joinedGame.temple,
                            numberOfPlayers: this.joinedGame.numberOfPlayers,
                            marketPlace: this.joinedGame.marketPlace,
                            stoneQuarry: this.joinedGame.stoneQuarry,
                            rounds: this.joinedGame.rounds,
                            players: this.joinedGame.players
                        }));
                        console.log("hey");
                    } else {
                        console.log("no games found");
                    }
                })
        }
    }

    // change to game screen
    changeToGameScreen(): void {
        localStorage.setItem('currentGame', JSON.stringify({
            id: this.joinedGame.id,
            name: this.joinedGame.name,
            owner: this.joinedGame.owner,
            status: this.joinedGame.status,
            currentPlayer: this.joinedGame.currentPlayer,
            roundCounter: this.joinedGame.roundCounter,
            obelisk: this.joinedGame.obelisk,
            burialChamber: this.joinedGame.burialChamber,
            pyramid: this.joinedGame.pyramid,
            temple: this.joinedGame.temple,
            numberOfPlayers: this.joinedGame.numberOfPlayers,
            marketPlace: this.joinedGame.marketPlace,
            stoneQuarry: this.joinedGame.stoneQuarry,
            rounds: this.joinedGame.rounds,
            players: this.joinedGame.players
        }));

        // #newWay
        this.saveGameVariables(this.joinedGame);
        this.savePlayerNumber(this.joinedGame);

        // deactivate polling if screen is left
        this.ngOnDestroy();
        //navigate to the game screen
        this.router.navigate(['/game']);
    }



    // #newWay
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
            players: players
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



    // ****************************
    // helper functions for the ui

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
