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
  gameMessages: PageElement[] = [];

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

    this.updateGameLog(this.gameId);

    // polling
    let that = this;
    this.timeoutId = setInterval(function () {
      //that.updateGameLog(that.gameId);
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

  shipMove(message:PageElement):boolean{
    return message.moveType == 'PLACE_STONE';
  }

  addShipToLog(messages: PageElement[]):void{
    console.log(messages);
    for(var i=0; i<messages.length; i++){
      if(messages[i].moveType == "PLACE_STONE"){
        console.log(messages[i].shipId);
        console.log(messages[i].id);

        var myDiv = document.getElementById("ship"+messages[i].shipId);
        var copyMyDiv = myDiv.cloneNode(true);
        var targetDiv = document.getElementById("message"+messages[i].id);
        targetDiv.appendChild(copyMyDiv);
        console.log(myDiv);
        messages[i].x = myDiv;
      }
    }
  }

  showMoveDetails(message: PageElement):void{
    if(message.moveType == 'PLACE_STONE'){
      var myDiv = document.getElementById("ship"+message.shipId);
      var count = $('#ship'+message.shipId+ ' .ship-middle .place').length;
      console.log(count);
      var position = count - message.placeOnShip+1;
      $('#ship'+message.shipId+' .ship-middle .place:nth-child('+ position).css("border", "1px solid red");
      myDiv.style.backgroundColor = "red";
    }
  }

  hideMoveDetails(message: PageElement):void{
    if(message.moveType == 'PLACE_STONE'){
      var myDiv = document.getElementById("ship"+message.shipId);
      myDiv.style.backgroundColor = "transparent";
      var count = $('#ship'+message.shipId+ ' .ship-middle .place').length;
      var position = count - message.placeOnShip+1;
      $('#ship'+message.shipId+' .ship-middle .place:nth-child('+ position).css("border", "none");
    }
  }

}
