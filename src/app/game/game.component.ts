import {Component, OnInit} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {GameService} from '../shared/services/game/game.service';

// models
import {User} from '../shared/models/user';
import {Game} from '../shared/models/game';
import {Player} from "../shared/models/player";
import {Round} from '../shared/models/round';
import {Router} from "@angular/router";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'],
    providers: [GameService]
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
    shipId: number[] = [];          // two way binding and variable passing to harbor (all ship id's of the current round)
    round: number = 0;              // two way binding and variable passing to harbor
    isSubRound: boolean = false;      // two way binding and variable passing
    isMyTurn: boolean = false;      // two way binding and variable passing
    isMySubRoundTurn: boolean = false;      // two way binding and variable passing
    hasRoundChanged: boolean = false;

    shipWantsToSail: boolean = false;

    //Market Card Play Handling - pass back to the harbor -> ships
    isPlayingMarketCard:boolean;
    playingMarketCardID:number;
    playingMarketCardType:string;


    private x: number = 0;

    constructor(private gameService: GameService,
                private router: Router ) {

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

                    // detect round change
                    this.hasRoundChanged = this.round != game.roundCounter;
                    this.round = game.roundCounter;

                    // enable to get end of round screen every 2nd polling
                    //this.hasRoundChanged = this.x%2==0;
                    //this.x++;


                    // get current game status
                    let gameStatus = game.status;

                    // check whether it is this client's player turn
                    this.isMyTurn = gameStatus == 'RUNNING' && this.currentPlayer == this.playerNumber;

                    // check whether a sub round is running or not
                    this.isSubRound = gameStatus == 'SUBROUND';

                    // check whether it is this client's player subround turn
                    this.isMySubRoundTurn = gameStatus != 'SUBROUND' && game.currentSubRoundPlayer == this.playerNumber;

                    // change to winning screen if game is finished
                    if (gameStatus == "FINISHED"){
                        this.changeToWinningScreen();
                    }

                    // get ships of current round
                    let ships = game.rounds[this.round-1].ships;

                    // save ship id
                    this.shipId = [];
                    for (let i=0; i<ships.length; i++) {
                        this.shipId.push(ships[i].id);
                    }

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
    isPlayingCard(is:boolean){
        console.log(is);
        this.isPlayingMarketCard = is;
    }

    cardId(id:number){
        console.log(id);
        this.playingMarketCardID = id;
    }

    cardType(type:string){
        console.log(type);
        this.playingMarketCardType = type;
    }
}
