import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {GameService} from '../shared/services/game/game.service';
import {MarketPlaceService} from '../shared/services/market-place/market-place.service';

// models
import {User} from '../shared/models/user';
import {Game} from '../shared/models/game';
import {Player} from "../shared/models/player";
import {Round} from '../shared/models/round';
import {Ship} from '../shared/models/ship';
import {Router} from "@angular/router";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
    providers: [GameService, MarketPlaceService]
})

export class GameComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    game: Game;
    gameId: number;
    playerNumber: number;

    // component fields
    currentPlayer: number;          // player number of the current player
    currentSubRoundPlayer: number;          // player number of the current sub round player
    shipId: number[] = [];          // two way binding and variable passing to harbor (all ship id's of the current round)
    round: number = 0;              // two way binding and variable passing to harbor
    isSubRound: boolean = false;      // two way binding and variable passing
    isMyTurn: boolean = false;      // two way binding and variable passing
    isMySubRoundTurn: boolean = false;      // two way binding and variable passing
    hasRoundChanged: boolean = false;
    gameStatus: string = "";

    shipWantsToSail: boolean = false;

    //Market Card Play Handling - pass back to the harbor -> ships
    isPlayingMarketCard: boolean = false;
    playingMarketCardID: number = 0;
    playingMarketCardType: string = "";

    numberOfFreeShipPlaces: number = 0;       // used for @HAMMER and @CHISEL to detect if move is possible
    numberOfShipsReadyToSail: number = 0;     // used for @LEVER to detect if move is possible

    private x: number = 0;

    constructor(private gameService: GameService,
                private marketPlaceService: MarketPlaceService,
                private router: Router,
                private changeDetectorRef: ChangeDetectorRef) {      // service to manually trigger variable-change-checks

    }

    ngOnInit() {
        // get game id from local storage
        this.game = JSON.parse(localStorage.getItem('game'));
        this.gameId = this.game.id;

        // get player number of this client's player
        this.playerNumber = JSON.parse(localStorage.getItem('player')).number;


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

                    // update current player and current round
                    this.currentPlayer = game.currentPlayer;
                    this.currentSubRoundPlayer = game.currentSubRoundPlayer;

                    // detect round change
                    this.hasRoundChanged = this.round != game.roundCounter;
                    this.round = game.roundCounter;

                    // enable to get end of round screen every 2nd polling
                    //this.hasRoundChanged = this.x%2==0;
                    //this.x++;


                    // get current game status
                    let gameStatus = game.status;
                    this.gameStatus = gameStatus;

                    // check whether it is this client's player turn
                    this.isMyTurn = gameStatus == 'RUNNING' && this.currentPlayer == this.playerNumber;

                    // check whether a sub round is running or not
                    this.isSubRound = gameStatus == 'SUBROUND';

                    // check whether it is this client's player subround turn
                    this.isMySubRoundTurn = gameStatus == 'SUBROUND' && game.currentSubRoundPlayer == this.playerNumber;

                    // change to winning screen if game is finished
                    if (gameStatus == "FINISHED") {
                        this.changeToWinningScreen();
                    }

                    // get ships of current round
                    // check if fast forward was made: thus there is only one round with roundNumber equals to 6
                    let ships;
                    if (game.rounds[0].roundNumber == 6) {
                        // fast forward: read ships of round 6 from first position of the array
                        ships = game.rounds[0].ships;
                    } else {
                        // no fast forward: read ships of current round
                        ships = game.rounds[this.round - 1].ships;
                    }

                    // save ship id
                    this.shipId = [];
                    for (let i = 0; i < ships.length; i++) {
                        this.shipId.push(ships[i].id);
                    }

                    // count number of free places on all ships
                    // for @HAMMER and @CHISEL
                    this.countTotalFreePlacesOnShips(ships);

                    // count number of ships that are ready to sail
                    // for @CHISEL
                    this.countReadyShips(ships);

                    // TODO: remove later on
                    // enable this to test picking market card
                    //this.isSubRound = true;
                    //this.isMySubRoundTurn = true;

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

    createDummyCard(marketCardType: string): void {
        this.marketPlaceService.createDummyCard(
            this.gameId,
            'BLUE',
            marketCardType
        ).subscribe(string => {
        });
    }

    changeToWinningScreen(): void {
        // deactivate polling if screen is left
        this.ngOnDestroy();
        //navigate to the winning screen
        this.router.navigate(['/winning-screen']);
    }


    handleShipDragging(isDragging) {
        this.shipWantsToSail = isDragging;
    }

    // MARKET CARD MOVE
    // save received emitters locally
    isPlayingCard(is: boolean) {
        this.isPlayingMarketCard = is;
        // trigger check of changed variables
        this.changeDetectorRef.detectChanges();
    }

    cardId(id: number) {
        this.playingMarketCardID = id;
        // trigger check of changed variables
        this.changeDetectorRef.detectChanges();
    }

    cardType(type: string) {
        this.playingMarketCardType = type;
        // trigger check of changed variables
        this.changeDetectorRef.detectChanges();
    }


    // Helper Function
    countTotalFreePlacesOnShips(ships: Ship[]) {
        let freePlaces: number = 0;         // total free spaces on all ships
        for (let i = 0; i < ships.length; i++) {
            // only add free spaces if ship has not sailed yet
            if (!ships[i].hasSailed) {
                freePlaces += ships[i].MAX_STONES - ships[i].stones.length
            }
        }

        this.numberOfFreeShipPlaces = freePlaces;
    }

    countReadyShips(ships: Ship[]) {
        let readyShips: number = 0;         // number of ships that are ready to sail
        for (let i = 0; i < ships.length; i++) {
            // only add ship if it has not sailed yet
            if (!ships[i].hasSailed) {
                // count ship if min stone is reached
                if (ships[i].stones.length >= ships[i].MIN_STONES) {
                    readyShips++;
                }
            }
        }

        this.numberOfShipsReadyToSail = readyShips;
    }
}
