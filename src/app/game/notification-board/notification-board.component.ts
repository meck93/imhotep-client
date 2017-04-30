import {Component, OnInit, AfterViewInit, Input, Output, OnDestroy, OnChanges, EventEmitter} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {NotificationBoardService} from '../../shared/services/notification-board/notification-board.service';
import {Page} from "../../shared/models/page";
import {PageElement} from "../../shared/models/page-element";
// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');

@Component({
  selector: 'notification-board',
  templateUrl: './notification-board.component.html',
  styleUrls: ['./notification-board.component.css'],
  providers: [NotificationBoardService]
})
export class NotificationBoardComponent implements OnInit, AfterViewInit {

  gameLog: Page;
  gameMessages: PageElement[];

  gameName: string;
  gameId: number;

  // polling
  private timeoutId: Timer;
  private timeoutInterval: number = componentPollingIntervall;

  constructor(private notificationBoardService: NotificationBoardService) { }

  ngOnInit() {
// get game id from local storage
    let game = JSON.parse(localStorage.getItem('game'));
    this.gameName = game.name;
    this.gameId = game.id;

    // polling
    let that = this;
    this.timeoutId = setInterval(function () {
      that.updateGameLog(that.gameId);
    }, this.timeoutInterval)
  }

  ngAfterViewInit(): void {
    var clicked = true;
    $("#notificationBoardDropDownClicker").on('click', function () {
      if (clicked) {
        clicked = false;
        $("#notifications").css({"top": "35px"});
      }
      else {
        clicked = true;
        $("#notifications").css({"top": "-1000px"});
      }
    });

    $(document).click(function () {
      clicked = true;
      $("#notifications").css({"top": "-1000px"});
    });

    $("#notificationBoardDropDownClicker").click(function (e) {
      e.stopPropagation();
    });
  }

  updateGameLog(gameId: number):void{
    this.notificationBoardService.updateGameLog(gameId)
        .subscribe(Page => {
          if (Page) {
            // updates the players array in this component
            this.gameLog = Page;
            this.gameMessages = Page.content;
          } else {
            console.log("no messages found");
          }
        })
  }

}
