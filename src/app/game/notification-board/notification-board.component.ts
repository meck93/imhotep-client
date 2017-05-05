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
    stagedMessages: PageElement[] = [];
    detailMove: PageElement = new PageElement();
    lastMove: PageElement = new PageElement;
    messagesInitialised: boolean = false;

    gameName: string;
    gameId: number;

    showMove: boolean = false;
    moveMade: boolean = false;
    isHoveringPopup: boolean = false;
    isSailed: boolean = false;

    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    private placeStoneMessage: string = ' placed a stone on a ship ';
    private getStonesMessage: string = ' got stones from the quarry ';
    private sailShipMessage: string = ' sailed a ship to the ';
    private getCardMessage: string = ' picked ';
    private playCardMessage: string = ' played card ';
    private moveMessage: string = '';

    constructor(private notificationBoardService: NotificationBoardService) {
    }

    ngOnInit() {
// get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameName = game.name;
        this.gameId = game.id;

        this.updateLastMovePopup();
        this.updateGameLog(this.gameId);
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
                $("#notifications").css({"right": "35px"});
            }
            else {
                clicked = true;
                $("#notifications").css({"right": "-500px"});
            }
        });

        $(document).click(function () {
            clicked = true;
            $("#notifications").css({"right": "-500px"});
        });

        $("#notificationBoardDropDownClicker").click(function (e) {
            e.stopPropagation();
        });

    }

    updateGameLog(gameId: number): void {
        this.notificationBoardService.updateGameLog(gameId)
            .subscribe(Page => {
                if (Page) {
                    if (Page.content.length > 0) {
                        // updates the players array in this component
                        this.gameLog = Page;
                        if (!this.messagesInitialised) {
                            this.stagedMessages = Page.content;
                            this.updateMoveMessages(Page.content);
                            this.gameMessages = Page.content;
                            this.lastMove = Page.content[0];
                            this.updateLastMovePopup();
                            this.messagesInitialised = true;
                        }
                        this.compareChanges(Page);
                        this.updateMoveMessages(this.gameMessages);
                    }
                } else {
                    console.log("no messages found");
                }
            })
    }

    compareChanges(page: Page): void {
        let changesMade: boolean = false;

        if (page.content.length > 0) {
            for (var i = 0; i < page.content.length; i++) {
                if (page.content[i].id != this.stagedMessages[i].id) {
                    changesMade = true;
                    break;
                }
            }
            if (changesMade) {
                this.gameMessages = page.content;
                this.stagedMessages = page.content;
            }

            if (this.gameMessages[0] != undefined) {
                if (this.lastMove.id != this.gameMessages[0].id) {
                    this.lastMove = page.content[0];
                    this.updateLastMovePopup();
                }
            }
        }
    }

    updateMoveMessages(messages: PageElement[]){
        for(let i=0; i<messages.length; i++){
            switch (messages[i].moveType) {
                case 'PLACE_STONE':
                    if($('#ship' + messages[i].shipId).children().length == 0){
                        messages[i].hasSailed = true;
                    }else{
                        messages[i].hasSailed = false;
                    }
                    messages[i].moveMessage = this.placeStoneMessage;
                    break;
                case 'GET_STONES':
                    messages[i].moveMessage = this.getStonesMessage;
                    break;
                case 'SAIL_SHIP':
                    switch(messages[i].targetSiteType){
                        case 'TEMPLE':
                            messages[i].moveMessage = this.sailShipMessage + 'Temple';
                            break;
                        case 'PYRAMID':
                            messages[i].moveMessage = this.sailShipMessage + 'Pyramids';
                            break;
                        case 'BURIAL_CHAMBER':
                            messages[i].moveMessage = this.sailShipMessage + 'Burial Chamber';
                            break;
                        case 'OBELISK':
                            messages[i].moveMessage = this.sailShipMessage + 'Obelisk';
                            break;
                        case 'MARKET_PLACE':
                            messages[i].moveMessage = this.sailShipMessage + 'Market Place';
                            break;
                    }
                    break;
                case 'GET_CARD':
                    switch(messages[i].marketCardType){
                        case 'ENTRANCE':
                            messages[i].moveMessage = this.getCardMessage + 'Entrance';
                            break;
                        case 'SARCOPHAGUS':
                            messages[i].moveMessage = this.getCardMessage + 'Sarcophagus';
                            break;
                        case 'PAVED_PATH':
                            messages[i].moveMessage = this.getCardMessage + 'Paved Path';
                            break;
                        case 'BURIAL_CHAMBER_DECORATION':
                            messages[i].moveMessage = this.getCardMessage + 'Burial Chamber Decoration';
                            break;
                        case 'TEMPLE_DECORATION':
                            messages[i].moveMessage = this.getCardMessage + 'Temple Decoration';
                            break;
                        case 'PYRAMID_DECORATION':
                            messages[i].moveMessage = this.getCardMessage + 'Pyramid Decoration';
                            break;
                        case 'OBELISK_DECORATION':
                            messages[i].moveMessage = this.getCardMessage + 'Obelisk Decoration';
                            break;
                        case 'STATUE':
                            messages[i].moveMessage = this.getCardMessage + 'Statue';
                            break;
                        case 'LEVER':
                            messages[i].moveMessage = this.getCardMessage + 'Lever';
                            break;
                        case 'HAMMER':
                            messages[i].moveMessage = this.getCardMessage + 'Hammer';
                            break;
                        case 'SAIL':
                            messages[i].moveMessage = this.getCardMessage + 'Sail';
                            break;
                        case 'CHISEL':
                            messages[i].moveMessage = this.getCardMessage + 'Chisel';
                            break;
                    }
                    break;
                case 'PLAY_CARD':
                    switch(messages[i].marketCardType){
                        case 'LEVER':
                            messages[i].moveMessage = this.playCardMessage + 'Lever';
                            break;
                        case 'HAMMER':
                            messages[i].moveMessage = this.playCardMessage + 'Hammer';
                            break;
                        case 'SAIL':
                            messages[i].moveMessage = this.playCardMessage + 'Sail';
                            break;
                        case 'CHISEL':
                            messages[i].moveMessage = this.playCardMessage + 'Chisel';
                            break;
                    }
                    break;
            }
        }
    }

    /*************************************************/
    /***************SHOW MOVE DETAILS****************/
    /*************************************************/
    showMoveDetails(message: PageElement): void {
        this.detailMove = message;
        this.showMove = true;
        this.highlightPlayerName(message.playerNr);

        switch (message.moveType) {
            case 'PLACE_STONE':
                this.highlightPlaceStoneMove(message);
                break;
            case 'GET_STONES':
                this.highlightGetStoneMove(message);
                break;
            case 'SAIL_SHIP':
                this.highlightSailMove(message);
                break;
            case 'GET_CARD':
                this.highlightGetCardMove(message);
                break;
            case 'PLAY_CARD':
                this.highlightPlayCardMove(message);
                break;
        }
    }
    highlightPlaceStoneMove(message: PageElement): void {
        var $exists = $('#ship' + message.shipId).children().length > 0;
        if ($exists) {
            this.highlightHarbor();
            this.highlightShip(message.shipId, message.placeOnShip);
        } else {
            this.highlightHarbor();
            this.highlightSmallHarborShip(message.shipId);

        }
    }
    highlightGetStoneMove(message: PageElement): void {
        this.highlightSupplySled(message.playerNr);
    }
    highlightSailMove(message: PageElement): void {
    }
    highlightGetCardMove(message: PageElement): void {
    }
    highlightPlayCardMove(message: PageElement): void {
        switch(message.marketCardType){
            case 'LEVER':
                this.highlightPlayCardMove_LEVER(message);
                break;
            case 'HAMMER':
                this.highlightPlayCardMove_HAMMER(message);
                break;
            case 'SAIL':
                this.highlightPlayCardMove_SAIL(message);
                break;
            case 'CHISEL':
                this.highlightPlayCardMove_CHISEL(message);
                break;
        }
    }

    highlightPlayCardMove_LEVER(message: PageElement):void{
        this.isSailed = true;
    }
    highlightPlayCardMove_HAMMER(message: PageElement):void{
        var $exists = $('#ship' + message.shipId).children().length > 0;
        if ($exists) {
            this.highlightHarbor();
            this.highlightShip(message.shipId, message.placeOnShip);
            this.highlightSupplySled(message.playerNr);
        } else {
            this.isSailed = true;
        }
    }
    highlightPlayCardMove_SAIL(message: PageElement):void{
        this.isSailed = true;
    }
    highlightPlayCardMove_CHISEL(message: PageElement):void{
        var $exists1 = $('#ship' + message.shipId).children().length > 0;
        var $exists2 = $('#ship' + message.shipId2).children().length > 0;
        if ($exists1 && $exists2) {
            this.highlightHarbor();
            this.highlightShip(message.shipId, message.placeOnShip);
            this.highlightShip(message.shipId2, message.placeOnShip2);
        }else if($exists1){
            this.highlightHarbor();
            this.highlightShip(message.shipId, message.placeOnShip);
            this.highlightSmallHarborShip(message.shipId2);
        }else if($exists2){
            this.highlightHarbor();
            this.highlightShip(message.shipId2, message.placeOnShip);
            this.highlightSmallHarborShip(message.shipId);
        }else{
            this.highlightHarbor();
            this.highlightSmallHarborShip(message.shipId);
            this.highlightSmallHarborShip(message.shipId2);
        }
    }
    /*************************************************/



    /*************************************************/
    /***************HIDE MOVE DETAILS****************/
    /*************************************************/
    hideMoveDetails(message: PageElement): void {
        this.detailMove = null;
        this.showMove = false;
        this.hidePlayerName(message.playerNr);

        switch (message.moveType) {
            case 'PLACE_STONE':
                this.hidePlaceStoneMove(message);
                break;
            case 'GET_STONES':
                this.hideGetStoneMove(message);
                break;
            case 'SAIL_SHIP':
                this.hideSailMove(message);
                break;
            case 'GET_CARD':
                this.hideGetCardMove(message);
                break;
            case 'PLAY_CARD':
                this.hidePlayCardMove(message);
                break;
        }
    }
    hidePlaceStoneMove(message: PageElement): void {
        var $exists = $('#ship' + message.shipId).children().length > 0;
        if ($exists) {
            this.hideHarbor();
            this.hideShip(message.shipId, message.placeOnShip);
        } else {
            this.hideHarbor();
            this.hideSmallHarborShip(message.shipId);
        }
    }
    hideGetStoneMove(message: PageElement): void {
        this.hideSupplySled(message.playerNr)
    }
    hideSailMove(message: PageElement): void {
    }
    hideGetCardMove(message: PageElement): void {
    }
    hidePlayCardMove(message: PageElement): void {
        switch(message.marketCardType){
            case 'LEVER':
                this.hidePlayCardMove_LEVER(message);
                break;
            case 'HAMMER':
                this.hidePlayCardMove_HAMMER(message);
                break;
            case 'SAIL':
                this.hidePlayCardMove_SAIL(message);
                break;
            case 'CHISEL':
                this.hidePlayCardMove_CHISEL(message);
                break;
        }
    }

    hidePlayCardMove_LEVER(message: PageElement):void{
        this.isSailed = false;
    }
    hidePlayCardMove_HAMMER(message: PageElement):void{
        this.hideHarbor();
        this.hideShip(message.shipId, message.placeOnShip);
        this.hideSupplySled(message.playerNr);
        this.isSailed = false;
    }
    hidePlayCardMove_SAIL(message: PageElement):void{
        this.isSailed = false;
    }
    hidePlayCardMove_CHISEL(message: PageElement):void{
        var $exists1 = $('#ship' + message.shipId).children().length > 0;
        var $exists2 = $('#ship' + message.shipId2).children().length > 0;
        if ($exists1 && $exists2) {
            this.hideHarbor();
            this.hideShip(message.shipId, message.placeOnShip);
            this.hideShip(message.shipId2, message.placeOnShip2);
        }else if($exists1){
            this.hideHarbor();
            this.hideShip(message.shipId, message.placeOnShip);
            this.hideSmallHarborShip(message.shipId2);
        }else if($exists2){
            this.hideHarbor();
            this.hideShip(message.shipId2, message.placeOnShip);
            this.hideSmallHarborShip(message.shipId);
        }else{
            this.hideHarbor();
            this.hideSmallHarborShip(message.shipId);
            this.hideSmallHarborShip(message.shipId2);
        }
    }
    /*************************************************/

    updateLastMovePopup(): void {
        if (!this.isHoveringPopup) {
            $("#lastMovePopup").removeClass("step");
            setTimeout(function () {
                $("#lastMovePopup").addClass("step");
            }, 5000);
        }
    }

    displayPopup(lastMove: PageElement): void {
        this.isHoveringPopup = true;
        this.showMoveDetails(lastMove);
        $("#lastMovePopup").removeClass("step");
    }

    hidePopup(lastMove: PageElement): void {
        this.isHoveringPopup = false;
        this.hideMoveDetails(lastMove);
        $("#lastMovePopup").addClass("step");
    }


    /************************************************************/
    /**************HELPER FUNCTIONS FOR HIGHLIGHTING*************/
    /************************************************************/

    highlightPlayerName(playerNr: number):void{
        $('#supplySled' + playerNr + ' .player').css("z-index", "1000");
    }
    hidePlayerName(playerNr: number):void{
        $('#supplySled' + playerNr + ' .player').css("z-index", "20");
    }

    highlightHarbor():void{
        $('.ship-container').css("opacity", "0.5");
        $('.harbor-container').css("z-index", "600");
    }
    hideHarbor():void{
        $('.ship-container').css("opacity", "1");
        $('.harbor-container').css("z-index", "0");
    }

    highlightShip(shipId:number, placeOnShip:number):void{
        let ship = document.getElementById("ship" + shipId);
        let count = $('#ship' + shipId + ' .ship-middle .place').length;
        let position = count - placeOnShip + 1;
        ship.style.opacity = "1.0";
        ship.style.backgroundColor = "grey";
        ship.style.border = "1px solid lime";
        ship.style.borderRadius = "5px";
        ship.style.zIndex = "1000";
        $('#ship' + shipId + ' .ship-middle .place:nth-child(' + position + ') .stone').css("border", "2px solid lime");
    }
    hideShip(shipId:number, placeOnShip:number):void{
        let ship = document.getElementById("ship" + shipId);
        let count = $('#ship' + shipId + ' .ship-middle .place').length;
        let position = count - placeOnShip + 1;
        ship.style.opacity = "1.0";
        ship.style.backgroundColor = "transparent";
        ship.style.border = "none";
        ship.style.borderRadius = "none";
        ship.style.zIndex = "auto";

        $('#ship' + shipId + ' .ship-middle .place:nth-child(' + position + ') .stone').css("border", "none");
    }

    highlightSupplySled(playerNr:number):void{
        let sled = document.getElementById("supplySled" + playerNr);

        sled.style.backgroundColor = "grey";
        sled.style.border = "1px solid lime";
        sled.style.borderRadius = "5px";
        sled.style.zIndex = "1000";
    }
    hideSupplySled(playerNr:number):void{
        let sled = document.getElementById("supplySled" + playerNr);

        sled.style.opacity = "1.0";
        sled.style.backgroundColor = "transparent";
        sled.style.border = "none";
        sled.style.borderRadius = "none";
        sled.style.zIndex = "auto";
    }

    highlightSmallHarborShip(shipId:number):void{
        $('#sailedShip'+shipId).show();
        $('.smallShip .ship-container').css("opacity", "1");
    }
    hideSmallHarborShip(shipId:number):void{
        $('#sailedShip'+shipId).hide();
        $('.smallShip .ship-container').css("opacity", "1");
    }


}
