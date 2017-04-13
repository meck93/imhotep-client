import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {GameService} from '../shared/services/game/game.service';

// models
import {User} from '../shared/models/user';
import {Game} from '../shared/models/game';
import {Player} from "../shared/models/player";
import {Round} from '../shared/models/round';
import {Router} from "@angular/router";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
    providers: [GameService]
})

export class GameComponent implements OnInit {
    receivedData: Array<any> = [];

    transferDataSuccess($event: any) {
        console.log($event);
        this.receivedData.push($event);
    }
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    game: Game;
    gameId: number;
    gameStatus: string;

    // component fields
    currentPlayer: number;          // player number of the current player
    shipId: number[] = [];          // two way binding and variable passing to harbor (all ship id's of the current round)
    round: number = 0;              // two way binding and variable passing to harbor

    constructor(private gameService: GameService,
                private router: Router ) {

    }

    ngOnInit() {
        // get game id from local storage
        this.game = this.gameId = JSON.parse(localStorage.getItem('game'));
        this.gameId = this.game.id;


        // polling
        this.updateGame();

        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateGame();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // TODO: first destroy all child components
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    updateGame(): void {
        this.gameService.getGameFromId(this.gameId)
            .subscribe(game => {
                if (game) {
                    // update current player
                    let localGame = JSON.parse(localStorage.getItem('game'));
                    this.currentPlayer = game.currentPlayer;

                    // get current round
                    let round = game.roundCounter;
                    this.round = round;

                    // get current game status
                    this.gameStatus = game.status;

                    // change to winning screen if game is finished
                    if (this.gameStatus == "FINISHED"){
                        this.changeToWinningScreen();
                    }

                    // get ships of current round
                    let ships = game.rounds[this.round-1].ships;

                    // save ship id
                    this.shipId = [];
                    for (let i=0; i<ships.length; i++) {
                        this.shipId.push(ships[i].id);
                    }
                    this.shipId.sort();
                } else {
                    // request error
                }
            })
    }

    createDummyStones(): void {
        this.gameService.createDummyStones(this.gameId)
            .subscribe(string => {
            })
    }

    changeToWinningScreen(): void {
        // deactivate polling if screen is left
        this.ngOnDestroy();
        //navigate to the winnnig screen
        this.router.navigate(['/winning-screen']);

    }
}