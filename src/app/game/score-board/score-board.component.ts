import {Component, OnInit, AfterViewInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';

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
    providers: [ScoreBoardService]
})

export class ScoreBoardComponent implements OnInit, AfterViewInit {
    @Input() ROUND: number;              // current round
    @Input() IS_SUB_ROUND: boolean;     // sub round flag
    @Input() STATUS: string;

    // outputs
    @Output() goToWinningScreen = new EventEmitter();

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    gameName: string;            // name of current game

    // component fields
    players: Player[];          // players of the current game

    confirmedRoundChange:boolean = false;
    localRoundCounter:number = 0;
    hasRoundChanged:boolean = false;
    lastRoundPoints:number[][]=[];
    playerPointsDifferences:number[][] = [];
    lastRoundPointsPlayer1:number[] = [0,0,0,0,0,0];
    lastRoundPointsPlayer2:number[] = [0,0,0,0,0,0];
    lastRoundPointsPlayer3:number[] = [0,0,0,0,0,0];
    lastRoundPointsPlayer4:number[] = [0,0,0,0,0,0];
    isDifferenceCalculated:boolean = false;

    constructor(private scoreBoardService: ScoreBoardService) {

    }

    // initialize component
    ngOnInit(): void {
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
    ngOnChanges(){
        if(this.localRoundCounter != this.ROUND){
            this.hasRoundChanged = true;
            this.confirmedRoundChange = false;
            if(this.players!=undefined){
                this.saveLastRound();
            }
            console.log("if");
        }else{
            this.hasRoundChanged = false;
            console.log("else");
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
                  /*  if(this.players!=undefined && !this.roundPointDifferenceSaved){
                        this.updatePointDifference(players);
                    }*/


                    /*
                    if(this.ROUND>0 && this.hasRoundChanged && !this.confirmedRoundChange && !this.isDifferenceCalculated){
                        console.log("updating differences");
                        this.updatePointDifference(players);
                        localStorage.setItem('pointDifferences', JSON.stringify(this.playerPointsDifferences));
                        this.isDifferenceCalculated = true;
                    }
                    */
                } else {
                    console.log("no players found");
                }
            })
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    ngAfterViewInit(): void {
        var clicked = true;
        $("#ScoreBoardDropDownClicker").on('click', function () {
            if (clicked) {
                clicked = false;
                $("#scoreBoard").css({"top": "15px"});
            }
            else {
                clicked = true;
                $("#scoreBoard").css({"top": "-205px"});
            }
        });

        $(document).click(function () {
            clicked = true;
            $("#scoreBoard").css({"top": "-205px"});
        });

        $("#ScoreBoardDropDownClicker").click(function (e) {
            e.stopPropagation();
        });
    }


    nextRound(): void {
        this.confirmedRoundChange = true;
        this.hasRoundChanged = false;
        this.lastRoundPoints = JSON.parse(localStorage.getItem('endOfLastRoundPoints'));
        if(this.ROUND == 6){
            this.goToWinningScreen.emit(true);
        }
    }

    /*updatePointDifference(players: Player[]){
        let x = JSON.parse(localStorage.getItem('endOfLastRoundPoints'));

        for(var i=0; i<players[0].points.length; i++){
            var delta = players[0].points[i] - x[0][i]; // 5 - 3 = 2
                this.playerPointsDifferences[0][i] = delta;
        }

        for(var i=0; i<players[1].points.length; i++){
            var delta = players[1].points[i] - x[1][i] ;// 6 - 2 = 4
                this.playerPointsDifferences[1][i] = delta;
        }

        this.isDifferenceCalculated = true;
    }*/

    initializeLastRoundPoints():void{
        let lastRoundPoints:number[][] = [];
        let lastRoundPointsSaved = JSON.parse(localStorage.getItem('roundPointDifferenceSaved'));
        if(!lastRoundPointsSaved){
            console.log("init");
            lastRoundPoints.push(this.lastRoundPointsPlayer1);
            lastRoundPoints.push(this.lastRoundPointsPlayer2);
            lastRoundPoints.push(this.lastRoundPointsPlayer3);
            lastRoundPoints.push(this.lastRoundPointsPlayer4);

            localStorage.setItem('endOfLastRoundPoints', JSON.stringify(lastRoundPoints));
            this.lastRoundPoints = lastRoundPoints;
            localStorage.setItem('roundPointDifferenceSaved', JSON.stringify(true));
        }else{
            console.log("load");
            this.lastRoundPoints = JSON.parse(localStorage.getItem('endOfLastRoundPoints'));
            console.log(this.lastRoundPoints);



            /*
            let players = this.players;
            console.log(x);
            console.log(players);

            if(players != undefined){
                for(var i=0; i<players[0].points.length; i++){
                    var delta = players[0].points[i] - x[0][i]; // 5 - 3 = 2
                    this.playerPointsDifferences[0][i] = delta;
                }

                for(var i=0; i<players[1].points.length; i++){
                    var delta = players[1].points[i] - x[1][i] ;// 6 - 2 = 4
                    this.playerPointsDifferences[1][i] = delta;
                }
                console.log(this.playerPointsDifferences);
            }
*/
        }
    }

    saveLastRound():void{
        console.log("saving");
        let points:number[][] = [];

        if(this.players != undefined){
            for(var i=0; i<this.players.length; i++){
                if(this.players[i].points != undefined){
                    points.push(this.players[i].points);
                }else{
                    points.push([0,0,0,0,0,0]);
                }

            }
        }
        console.log(points);
        localStorage.setItem('endOfLastRoundPoints', JSON.stringify(points));
    }

}
