import {Component, OnInit, ElementRef} from '@angular/core';
import {Game} from '../shared/models/game';
import {GameService} from "../shared/services/game/game.service";
import {User} from "../shared/models/user";
import {UserService} from '../shared/services/user/user.service';
import {Player} from "../shared/models/player";
import {Round} from "../shared/models/round";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/services/authentication/authentication.service";
import Timer = NodeJS.Timer;

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
    providers: [GameService],
})
export class LobbyComponent implements OnInit {
    user: User;
    games: Game[];
    game: Game;
    newGame: Game;
    joinedGame: Game; //the game the User joins
    playerID: number;
    firstLogin:boolean = true;

    private timoutInterval: number = 3000;
    private timoutId: Timer;

    constructor(private router: Router, private gameService: GameService, private userService: UserService, private authService: AuthenticationService, private myElement: ElementRef) {
    }

    ngOnInit(): void {
        this.newGame = new Game();
        // get available games
        this.getGames();
        // get current logged in user
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        // set playerID
        this.playerID = this.user.id;
        this.joinedGame = JSON.parse(localStorage.getItem('joinedGame'));




        var that = this;
        this.timoutId = setInterval(function () {
            //get all games from the server
            that.getGames();

            //update the local joined game of the logged in user
            that.updateJoinedGame();

            this.joinedGame = JSON.parse(localStorage.getItem('joinedGame'));
            //this.checkForGames();

            //that.updateJOinedGameUsers();

        }, this.timoutInterval)
    }

    updateJoinedGame(): void {
        //this.gameService.getGames().then(games => this.games = games);
        if (this.joinedGame != undefined) {
            console.log("You are in Game# "+this.joinedGame.id);
            console.log("You have ID# "+this.user.id);
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
        };
    }

    isGameNameEmpty(){
            return this.myElement.nativeElement.querySelector('#gameCreation').value == "";

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
        this.gameService.joinGame(gameToJoin, this.user)
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
        console.log(this.joinedGame.name);
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
    createGame(): void {
        if(this.newGame.name.length>15){
            alert("The game name must have less than 15 characters");
            return;
        }
        this.gameService.createGame(this.user, this.newGame.name)
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
                console.log(this.joinedGame.name);
                this.games.push(game);
            });
    }
}
