import {Component, OnInit, Input} from '@angular/core';

// models
import {Player} from '../../shared/models/player';

@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css']
})

export class SupplySledComponent implements OnInit {
    // color of this supply sled
    @Input() color: String = '';

    // number of the player
    @Input() nr: number = 0;

    // current player of the game
    @Input() currentPlayer: number = 0;

    // #newWay
    gameId: number;

    // player number and color of logged in user/player
    clientPlayerNumber: number;
    clientPlayerColor: string;

    // player of this sled
    sledPlayerName: string;

    constructor() {

    }

    ngOnInit() {
        // #newWay
        // get game id and number of players from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.clientPlayerNumber = player.playerNumber;
        this.clientPlayerColor = player.playerColor;

        // get players of game from local storage
        let players = game.players;

        // set player name of this sled
        this.sledPlayerName = players[this.nr-1].username;
        console.log(players);
        console.log(this.nr);
        console.log(this.sledPlayerName);


// TODO: change for polling
        // get players of game form local storage
        let game2 = JSON.parse(localStorage.getItem('currentGame'));

        // get current player of the game
        if (game2.currentPlayer != undefined) {
            this.currentPlayer = game2.currentPlayer;
        }
    }

    getStones() {

    }
}
