import {Component, OnInit, Input} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {Player} from '../../shared/models/player';
import {SupplySled} from '../../shared/models/supplySled';
import {SupplySledService} from '../../shared/services/supply-sled/supply-sled.service'

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;


@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css'],
    providers: [SupplySledService]
})

export class SupplySledComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() color: string;                // color of this supply sled
    @Input() nr: number;                        // number of the player
    @Input() currentPlayer: number = 0;         // current player of the game

    // local storage data
    gameId: number;
    clientPlayerNumber: number;                 // logged in player number
    clientPlayerColor: string;                  // logged in player color
    sledPlayerName: string;                     // player name of this sled

    // component fields
    sledStones: Stone[]=[];

    constructor(private supplySledService: SupplySledService ) {

    }

    // initialize component
    ngOnInit() {
        // get game id and number of players from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));

        // client player data from local storage player
        this.clientPlayerNumber = player.number;
        this.clientPlayerColor = player.playerColor;

        // initialize the components playerNr
        this.nr = this.nr;

        // get players of game from local storage
        let players = game.players;

        // set player name of this sled
        this.sledPlayerName = players[this.nr-1].username;

        // update stone sleds
        this.updateSupplySled();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            // get current player
            let game = JSON.parse(localStorage.getItem('game'));
            that.currentPlayer = game.currentPlayer;
            that.updateSupplySled();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }


    //TODO: make sure, that correctly colored stones are displayed for each player seperately
    // gets the current player supply sled stones from the server
    updateSupplySled():void{
      this.supplySledService.updateSupplySledStones(this.gameId, this.nr)
        .subscribe(playerData => {
          if (playerData) {
            // retrieved data
            this.sledStones = playerData.supplySled.stones;
          } else {
            console.log("supply sled data error");
          }
        })
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
