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
        let game = this.gameId = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // TODO: remove later on when we don't need the "game information panel" anymore
        this.game = JSON.parse(localStorage.getItem('currentGame'));

        // polling
        this.refreshGame();

        let that = this;
        this.timeoutId = setInterval(function () {
            that.refreshGame();
        }, this.timeoutInterval)
    }

    createDummyStones(): void {
        this.gameService.createDummyStones(this.game.id)
            .subscribe(string => {
            })
    }

    refreshGame(): void {
        this.gameService.getGameFromId(this.gameId)
            .subscribe(game => {
                if (game) {
                    // update current player
                    this.currentPlayer = game.currentPlayer;
                } else {
                    // request error
                }
            })
    }
}
