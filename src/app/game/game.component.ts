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

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
    providers: [GameService]
})

export class GameComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    game: Game;
    gameId: number;

    // component fields
    currentPlayer: number;          // player number of the current player
    shipId: number[] = [];          // two way binding and variable passing to harbor (all ship id's of the current round)
    round: number = 0;              // two way binding and variable passing to harbor

    constructor(private gameService: GameService) {

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
                    localGame.currentPlayer = game.currentPlayer;   //TODO: remove, when all no component uses the current player anymore (replace with two way binding/variable passing)
                    this.currentPlayer = game.currentPlayer;

                    // get current round
                    let round = game.roundCounter;
                    this.round = round;

                    // get ships of current round
                    let ships = game.rounds[this.round-1].ships;

                    // save ship id
                    this.shipId = [];
                    for (let i=0; i<ships.length; i++) {
                        this.shipId.push(ships[i].id);
                    }

                    // save game to local storage
                    localStorage.setItem('game', JSON.stringify(localGame));
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
}
