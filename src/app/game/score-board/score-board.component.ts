import {Component, OnInit, AfterViewInit, Input, Output, OnDestroy, OnChanges, EventEmitter, HostListener} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ScoreBoardService} from '../../shared/services/score-board/score-board.service';

// models
import {Player} from '../../shared/models/player';
import {Game} from '../../shared/models/game';
import {temporaryDeclaration} from "@angular/compiler/src/compiler_util/expression_converter";

// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');
declare let jQuery: any;

@Component({
    selector: 'score-board',
    templateUrl: './score-board.component.html',
    styleUrls: ['./score-board.component.css'],
    providers: [ScoreBoardService],
    host:{'(window:keyup)': 'keyup($event)'}
})

export class ScoreBoardComponent implements OnInit, OnDestroy,OnChanges {
    @Input() ROUND: number;                 // current round
    @Input() IS_SUB_ROUND: boolean;         // sub round flag
    @Input() STATUS: string = "";

    // outputs
    @Output() goToWinningScreen = new EventEmitter();

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    gameName: string;                                           // name of current game

    // component fields
    players: Player[];                                          // players of the current game
    sortedPlayers: Player[];                                    // players sorted according to their points

    confirmedRoundChange: boolean = false;                      // flag to close
    localRoundCounter: number = 0;
    hasRoundChanged: boolean = false;                           // flag if round has changed
    lastRoundPoints: number[][] = [];                           // saved points of last round
    fastForwardInitialized: boolean = false;
    lastRoundPointsPlayer1: number[] = [0, 0, 0, 0, 0, 0, 1];
    lastRoundPointsPlayer2: number[] = [0, 0, 0, 0, 0, 0, 1];
    lastRoundPointsPlayer3: number[] = [0, 0, 0, 0, 0, 0, 1];
    lastRoundPointsPlayer4: number[] = [0, 0, 0, 0, 0, 0, 1];

    code:string = '';                                           // keyboard input code
    showScoreBoard: boolean = false;                            // flag if player has pressed Tab
    showScoreBoardClick: boolean = false;                       // flag if player opens scoreboard via click

    static alreadyInit: boolean = false;                        // flag if the component has already been initialized

    constructor(private scoreBoardService: ScoreBoardService) {

    }

    // adds listener to client keyboard
    // if Tab is not pressed anymore, the score board closes
    @HostListener('window:keyup')
    keyUp(){
        this.showScoreBoard = false;
    }

    // adds listener to client keyboard
    // if Tab pressed , the score board is shown
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if(event.code == 'Tab'){
            this.showScoreBoard = true;
        }
    }

    // initialize component
    ngOnInit(): void {
        // ensure that component only initializes once
        if (ScoreBoardComponent.alreadyInit) {
            return;
        }
        ScoreBoardComponent.alreadyInit = true;
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameName = game.name;
        this.gameId = game.id;
        this.localRoundCounter = this.ROUND;
        this.initializeLastRoundPoints();
        this.updateScoreBoard(this.gameId);
        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateScoreBoard(that.gameId);
            that.localRoundCounter = that.ROUND;
        }, this.timeoutInterval)
    }


    // save player points of last round
    ngOnChanges() {
        if (this.localRoundCounter != this.ROUND) {
            this.hasRoundChanged = true;
            this.confirmedRoundChange = false;

        } else {
            // triggers one last round summary if game has finished
            if (this.STATUS == 'FINISHED') {
                this.hasRoundChanged = true;
                this.confirmedRoundChange = false;
            } else {
                this.hasRoundChanged = false;
            }
        }

    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // gets the updated Players and their points
    updateScoreBoard(gameId: number): void {
        this.scoreBoardService.updatePoints(gameId)
            .subscribe(players => {
                if (players) {
                    // updates the players array in this component
                    this.players = players;
                    this.sortPlayers(this.players);
                    if(this.localRoundCounter > this.lastRoundPoints[0][6] && this.confirmedRoundChange){
                        this.saveLastRound();
                    }
                } else {
                    console.log("no players found");
                }
            })
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************
    toggleScores(){
        this.showScoreBoardClick = !this.showScoreBoardClick;
    }

    sortPlayers(players: Player[]): void {

        let scores: number[] = [];          // holds scores of the players
        let sortedPlayers:Player[] = [];    // players sorted according to total points

        for (var i = 0; i < players.length; i++) {
            // get all total points of all players
            scores.push(players[i].points[5]);
        }

        // sort the points
        scores.sort(function(a, b){return b-a});

        let addedPlayers:string[] = [];

        // sort the players in the correct order
        for(var i=0; i<scores.length; i++){
            for(var j=0; j<players.length;j++){
                // check if the player has been locked at already, if yes, then don't add
                if(players[j].points[5] === scores[i] && (addedPlayers.indexOf(players[j].username) == -1)){
                    sortedPlayers.push(players[j]);
                    addedPlayers.push(players[j].username);
                    j++;
                }
            }
        }

        // set the sortedPlayers array equal to the sorted array
        this.sortedPlayers = sortedPlayers;
    }

    // if button is pressed the round summary is hidden
    nextRound(): void {
        this.confirmedRoundChange = true;
        this.hasRoundChanged = false;
        if (this.ROUND == 6 && this.players[0].points[2] > 0) {
            this.goToWinningScreen.emit(true);
        }
    }

    // initialize the round points for displaying the differences
    initializeLastRoundPoints(): void {
        let lastRoundPoints: number[][] = [];
        let lastRoundPointsSaved = JSON.parse(localStorage.getItem('roundPointDifferenceSaved'));
        let isFastForward = JSON.parse(localStorage.getItem('isFastForward'));
        if (!lastRoundPointsSaved) {
            if (isFastForward && !this.fastForwardInitialized) {
                lastRoundPoints.push([6, 1, 0, 0, 0, 7, 5]);
                lastRoundPoints.push([11, 3, 0, 0, 0, 14, 5]);
                lastRoundPoints.push([0, 0, 0, 0, 0, 0, 5]);
                lastRoundPoints.push([0, 0, 0, 0, 0, 0, 5]);
                this.fastForwardInitialized = true;
            } else {
                lastRoundPoints.push(this.lastRoundPointsPlayer1);
                lastRoundPoints.push(this.lastRoundPointsPlayer2);
                lastRoundPoints.push(this.lastRoundPointsPlayer3);
                lastRoundPoints.push(this.lastRoundPointsPlayer4);
            }
            localStorage.setItem('endOfLastRoundPoints', JSON.stringify(lastRoundPoints));
            this.lastRoundPoints = lastRoundPoints;
            localStorage.setItem('roundPointDifferenceSaved', JSON.stringify(true));
        } else {
            this.lastRoundPoints = JSON.parse(localStorage.getItem('endOfLastRoundPoints'));
        }
    }

    // save the points of the round before the beginning of a new round
    saveLastRound(): void {
        let points: number[][] = [];
        if (this.players != undefined ) {
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].points != undefined) {
                    points.push(this.players[i].points);
                    points[i][6] = this.localRoundCounter;
                } else {
                    points.push([0, 0, 0, 0, 0, 0, 0]);
                }
            }
        }
        localStorage.setItem('endOfLastRoundPoints', JSON.stringify(points));
        this.lastRoundPoints = points;
    }

}