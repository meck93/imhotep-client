import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {MoveService} from '../../shared/services/move/move.service';
import {PlayerService} from '../../shared/services/player/player.service';

// models
import {Stone} from '../../shared/models/stone';
import {Player} from '../../shared/models/player';
import {SupplySled} from '../../shared/models/supplySled';
import {MarketCard} from "../../shared/models/market-card";


@Component({
    selector: 'supply-sled',
    templateUrl: './supply-sled.component.html',
    styleUrls: ['./supply-sled.component.css'],
    providers: [PlayerService, MoveService]
})

export class SupplySledComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() NR: number;                                // number of the player
    @Input() COLOR: string;                             // color of this supply sled
    @Input() CURRENT_PLAYER: number = 0;                // current player of the game
    @Input() CURRENT_SUB_ROUND_PLAYER: number = 0;      // current sub round player of the game
    @Input() ROUND_NR: number = 0;                      // current round of the game
    @Input() IS_SUB_ROUND: boolean = false;
    @Input() IS_MY_TURN: boolean = false;
    @Input() CARD_IS_PLAYING: boolean = false;
    @Input() NUMBER_OF_FREE_SHIPS_PLACES: number = 0;
    @Input() NUMBER_OF_SHIPS_READY_TO_SAIL: number = 0;

    // OUTPUT DATA FOR THE PLAY MARKET CARD MOVE
    @Output() IS_PLAYING_CARD = new EventEmitter<boolean>();
    @Output() CARD_ID = new EventEmitter<number>();
    @Output() CARD_TYPE = new EventEmitter<string>();


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
    playerCards: MarketCard[];

    constructor(private playerService: PlayerService,
                private moveService: MoveService) {

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
        this.NR = this.NR;

        // get players of game from local storage
        let players = game.players;

        // set player name of this sled
        this.sledPlayerName = players[this.NR - 1].username;

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
        this.playerService.getPlayer(this.gameId, this.NR)
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

                    this.playerCards = playerData.handCards;

                } else {
                    console.log("supply sled data error");
                }
            })
    }

    getStones(): void {
        if (!this.IS_SUB_ROUND && this.IS_MY_TURN && this.isMySled() && !this.isSledFull()) {
            this.moveService.getStones(this.gameId, this.ROUND_NR, this.clientPlayerNumber)
                .subscribe(response => {
                    //TODO: catch error
                    console.log(response);
                });
        }
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

    isMySled() {
        // checks whether the sled corresponds to the current player and the player number of this client
        return this.clientPlayerNumber == this.NR
    }

    isPlayingCard(is: boolean) {
        this.CARD_IS_PLAYING = is;
        this.IS_PLAYING_CARD.emit(is);
    }

    cardId(id: number) {
        this.CARD_ID.emit(id);
    }

    cardType(type: string) {
        this.CARD_TYPE.emit(type);
    }
}
