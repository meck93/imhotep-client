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
    currentPlayer: number;

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
                    localGame.currentPlayer = game.currentPlayer;

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
