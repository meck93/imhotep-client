import {Component, OnInit, AfterViewInit, Input, OnChanges} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ScoreBoardService} from '../../shared/services/score-board/score-board.service';

// models
import {Player} from '../../shared/models/player';
import {Game} from '../../shared/models/game';

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

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // local storage data
    gameId: number;
    gameName: string;            // name of current game

    // component fields
    players: Player[];          // players of the current game

    confirmedRoundChange: boolean = false;
    localRoundCounter: number = 0;
    hasRoundChanged: boolean = false;
    playerPointsDifferences: number[][] = [];
    player1Points: number[] = [0, 0, 0, 0, 0, 0];
    player2Points: number[] = [0, 0, 0, 0, 0, 0];
    player3Points: number[] = [0, 0, 0, 0, 0, 0];
    player4Points: number[] = [0, 0, 0, 0, 0, 0];


    constructor(private scoreBoardService: ScoreBoardService) {

    }

    // initialize component
    ngOnInit(): void {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameName = game.name;
        this.gameId = game.id;
        this.localRoundCounter = this.ROUND;
        this.updateScoreBoard(this.gameId);

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateScoreBoard(that.gameId);
            that.localRoundCounter = that.ROUND;
        }, this.timeoutInterval)
    }

    ngOnChanges() {
        if (this.localRoundCounter != this.ROUND) {
            this.hasRoundChanged = true;
            this.confirmedRoundChange = false;
        } else {
            this.hasRoundChanged = false;
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
                    this.updatePlayerPoints(players);
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
    }

    updatePlayerPoints(players: Player[]): void {
        for (var i = 0; i < 6; i++) {
            this.player1Points[i] = (players[0].points[i] - this.player1Points[i]);
        }

        for (var i = 0; i < 6; i++) {
            this.player2Points[i] = (players[1].points[i] - this.player2Points[i]);
        }

        if (players.length > 2 && players.length < 4) {
            this.player3Points = players[2].points;
        } else if (players.length > 3) {
            this.player4Points = players[3].points;
        }

        this.playerPointsDifferences.push(this.player1Points);
        this.playerPointsDifferences.push(this.player2Points);
    }
}
