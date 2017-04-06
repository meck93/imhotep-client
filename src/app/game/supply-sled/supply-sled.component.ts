import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css']
})
export class SupplySledComponent implements OnInit {// input variable for component
    // color of this supply sled
    @Input() color: String = '';

    // #newWay
    gameId: number;

    // player number and color of logged in user/player
    playerNumber: number;
    playerColor: string;

    // TODO: needs to be initialized to 0 as soon as game sets the field current player correctly
    currentPlayer: number = 1;

    constructor() {

    }

    ngOnInit() {
        // #newWay
        // get game id and number of players from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.playerNumber = player.playerNumber;
        this.playerColor = player.playerColor;





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
