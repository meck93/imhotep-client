import {Component, OnInit, AfterViewInit} from '@angular/core';

// polling
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
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = 2000;

    // local storage data
    game: Game;                 // current game
    gameId: number;

    // component fields
    players: Player[];          // players of the current game

    // TODO: implement polling (local storage)
    roundCounter: number = 1;

    constructor(private scoreBoardService: ScoreBoardService) {

    }

    // initialize component
    ngOnInit(): void {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        this.updateScoreBoard(this.gameId);

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateScoreBoard(that.gameId);
        }, this.timeoutInterval)
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
                $("#scoreBoard").css({"top": 0});
            }
            else {
                clicked = true;
                $("#scoreBoard").css({"top": "-200px"});
            }
        });

        $(document).click(function () {
            clicked = true;
            $("#scoreBoard").css({"top": "-200px"});
        });

        $("#ScoreBoardDropDownClicker").click(function (e) {
            e.stopPropagation();
        });
    }
}
