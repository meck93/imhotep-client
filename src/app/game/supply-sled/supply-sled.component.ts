import {Component, OnInit, Input} from '@angular/core';

// polling
import Timer = NodeJS.Timer;

// models
import {Player} from '../../shared/models/player';

@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css']
})

export class SupplySledComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = 2000;

    // inputs
    @Input() color: String = '';                // color of this supply sled
    @Input() nr: number = 0;                    // number of the player
    @Input() currentPlayer: number = 0;         // current player of the game

    // local storage data
    gameId: number;
    clientPlayerNumber: number;                 // logged in player number
    clientPlayerColor: string;                  // logged in player color
    sledPlayerName: string;                     // player name of this sled

    constructor() {

    }

    // initialize component
    ngOnInit() {
        // get game id and number of players from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.clientPlayerNumber = player.number;
        this.clientPlayerColor = player.playerColor;

        // get players of game from local storage
        let players = game.players;

        // set player name of this sled
        this.sledPlayerName = players[this.nr-1].username;

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            // get current player
            let game = JSON.parse(localStorage.getItem('game'));
            that.currentPlayer = game.currentPlayer;
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // TODO: implement move
    getStones() {

    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // TODO: as soon as sleds of players have stones in it
    isSledFull() {
        return false;
    }
}
