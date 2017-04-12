import {Component, OnInit, Input} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {Player} from '../../shared/models/player';
import {SupplySled} from '../../shared/models/supplySled';
import {SupplySledService} from '../../shared/services/supply-sled/supply-sled.service';
import {MoveService} from '../../shared/services/move/move.service';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;
import {GameService} from "../../shared/services/game/game.service";


@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css'],
    providers: [SupplySledService, MoveService]
})

export class SupplySledComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() color: string;                // color of this supply sled
    @Input() nr: number;                   // number of the player
    @Input() currentPlayer: number = 0;    // current player of the game
    @Input() roundNr: number = 0;          // current round of the game

    // local storage data
    gameId: number;
    clientPlayerNumber: number;                 // logged in player number
    clientPlayerColor: string;                  // logged in player color
    sledPlayerName: string;                     // player name of this sled

    // component fields
    sledStones: Stone[] = [];
    quarryStones: number = 30;
    hasSledChanged: boolean[] = [];
    hasQuarryChanged: boolean;

    constructor(private supplySledService: SupplySledService, private moveService: MoveService, private gameService: GameService) {

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
        this.sledPlayerName = players[this.nr - 1].username;

        // update stone sleds
        this.updateSupplySled();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            // update stones on the supply sled
            that.updateSupplySled();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // gets the current player supply sled stones from the server
    updateSupplySled(): void {
        this.supplySledService.updateSupplySledStones(this.gameId, this.nr)
            .subscribe(playerData => {
                if (playerData) {
                    // calculate newly added stones
                    let newStones = Math.abs(this.sledStones.length - playerData.supplySled.stones.length);

                    // check for changes
                    for (let i = 0; i < 5; i++) {
                        if ((this.sledStones[i] == undefined && playerData.supplySled.stones[i] != undefined) ||
                            (this.sledStones[i] != undefined && playerData.supplySled.stones[i] == undefined)) {
                            this.hasSledChanged[i] = true;
                        } else {
                            this.hasSledChanged[i] = false;
                        }
                    }

                    this.hasQuarryChanged = this.sledStones.length < playerData.supplySled.stones.length;

                    // calculate remaining stones in stone quarry
                    // TODO: Maybe server needs to keep track of the player stones, as stones can also taken from the stonequarry directly (see rules for red market card)
                    if (this.sledStones.length < playerData.supplySled.stones.length) {
                        this.quarryStones = this.quarryStones - newStones;
                    }

                    // save retrieved data
                    this.sledStones = playerData.supplySled.stones;

                } else {
                    console.log("supply sled data error");
                }
            })
    }

    getStones(): void {
        this.moveService.getStones(this.gameId, this.roundNr, this.clientPlayerNumber)
            .subscribe(response => {
                //TODO: catch error
                console.log(response);
            });
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // returns boolean if all 5 places on the supply sled is occupied
    isSledFull() {
        if (this.sledStones.length == 5) {
            return true;
        }
        return false;
    }

    isMyTurn() {
        // checks whether the sled corresponds to the current player and the player number of this client
        return this.nr == this.currentPlayer && this.clientPlayerNumber == this.nr
    }
}
