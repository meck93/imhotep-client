import {Component, OnInit} from '@angular/core';

// services
import {WinningScreenService} from '../shared/services/winning-screen/winning-screen.service';

// models
import {Router} from "@angular/router";
import {Player} from '../shared/models/player';
import {Game} from '../shared/models/game';
import {User} from "app/shared/models/user";
import {LobbyComponent} from "../lobby/lobby.component";
import {AuthenticationService} from "../shared/services/authentication/authentication.service";

@Component({
    selector: 'app-winning-screen',
    templateUrl: './winning-screen.component.html',
    styleUrls: ['./winning-screen.component.css'],
    providers: [WinningScreenService]
})
export class WinningScreenComponent implements OnInit {

    // local storage data
    game: Game;                  // current game
    player: Player;
    user: User;
    gameId: number;
    gameName: string;            // name of current game
    numberOfPlayers: number;
    errorMessage: string;

    // component fields
    players: Player[] = [];          // players of the current game
    savedPlayers: Player[] = [];
    playersRanked: Player[] = [];
    hasPlayerPointsSaved: boolean = false;

    constructor(private winningScreenService: WinningScreenService,
                private router: Router,
                private authService: AuthenticationService) {

    }

    ngOnInit() {
        // workaround for killing game polling
        if (LobbyComponent.wasInGame) {
            LobbyComponent.wasInGame = false;
            location.reload();
        }
        // gets the ranked players from local storage of the finished game
        this.playersRanked = JSON.parse(localStorage.getItem('playersRanked'));
        // get game id from local storage
        this.game = JSON.parse(localStorage.getItem('game'));
        // get current logged in user from local storage
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.gameName = this.game.name;
        this.gameId = this.game.id;
        this.numberOfPlayers = this.game.numberOfPlayers;

        // get current logged in user from local storage
        this.player = JSON.parse(localStorage.getItem('currentUser'));

        this.getSummary(this.gameId);
    }

    // gets the Players and their points
    getSummary(gameId: number): void {
        this.winningScreenService.getPoints(gameId)
            .subscribe(players => {
                if (players) {
                    // updates the players array in this component
                    this.players = players;
                    if(!this.hasPlayerPointsSaved){
                        this.savedPlayers = players;
                        this.hasPlayerPointsSaved = true;
                    }
                } else {
                    console.log("no players found");
                }
            });
    }

    // delete game and navigate back to lobby
    deleteGame(game: Game): void {
        this.winningScreenService.deleteGame(game, this.player)
            .subscribe(game => {
                localStorage.removeItem('playersRanked');
            }, error => this.errorMessage = <any>error);

        // leave screen anyway
        this.router.navigate(['/lobby']);
    }

    // log out the user from the server
    logout(): void {
        this.authService.logout(this.user.id)
            .subscribe(string => {
                }
                , error => this.errorMessage = "Logout failed, try again");
        // navigate to login screen
        localStorage.removeItem('playersRanked');
        this.router.navigate(['/login']);
    }
}
