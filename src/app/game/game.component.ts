import {Component, OnInit} from '@angular/core';

// polling
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
    private timeoutInterval: number = 2000;

    // local storage data
    gameId: number;

    // component fields
    currentPlayer: number;



    game: Game;

    constructor(private gameService: GameService) {

    }

    ngOnInit() {
        // #newWay
        // get game id from local storage
        this.game = this.gameId = JSON.parse(localStorage.getItem('game'));
        this.gameId = this.game.id;

        // polling
        this.refreshGame();

        let that = this;
        this.timeoutId = setInterval(function () {
            that.refreshGame();
        }, this.timeoutInterval)
    }

    createDummyStones(): void {
        this.gameService.createDummyStones(this.gameId)
            .subscribe(string => {
            })
    }

    refreshGame(): void {
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
}
