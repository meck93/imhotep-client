import { Component, OnInit } from '@angular/core';
import {ScoreBoardService} from '../../shared/services/score-board/score-board.service';
import { Game } from '../../shared/models/game';

@Component({
  selector: 'score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css'],
  providers: [ScoreBoardService]
})
export class ScoreBoardComponent implements OnInit {

  game:Game;

  constructor(private scoreBoardService:ScoreBoardService) { }

  ngOnInit(): void {
    this.game = JSON.parse(localStorage.getItem('currentGame'));
  }

}
