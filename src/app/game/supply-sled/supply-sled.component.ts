import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css']
})
export class SupplySledComponent implements OnInit {// input variable for component
    // color of this supply sled
    @Input() color: String = '';

    // player number and color of logged in user/player
    playerNumber: number;
    playerColor: string;

    // TODO: needs to be initialized to 0 as soon as game sets the field current player correctly
    currentPlayer: number = 1;

    constructor() {

    }

    ngOnInit() {
        // get user id from local storage
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let userId = user.id;

        // get players of game form local storage
        let game = JSON.parse(localStorage.getItem('currentGame'));
        let players = game.players;

        // get current player of the game
        if (game.currentPlayer != undefined) {
            this.currentPlayer = game.currentPlayer;
        }

        // find player number and color of this player
        let player;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == userId) {
                player = players[i];
                break;
            }
        }
        this.playerNumber = player.playerNumber;
        this.playerColor = player.color;

        console.log("sled color: " + this.color);
        console.log("player color: " + this.playerColor);
        console.log("current player: " + this.currentPlayer);
        console.log("player number: " + this.playerNumber);
    }

    getStones() {

    }
}
