import {Component, OnInit, Input} from '@angular/core';
import {MarketCard} from "../../shared/models/market-card";
import {MARKETCARDS} from "../../shared/models/mock-cards";


@Component({
    selector: 'player-cards',
    templateUrl: 'player-cards.component.html',
    styleUrls: ['player-cards.component.css']
})
export class PlayerCardsComponent implements OnInit {

    // inputs
    @Input() CARDS: MarketCard[];               // hand cards of this player
    @Input() NR: number;                        // sled number
    @Input() CURRENTPLAYER: number;             // number of current player
    @Input() IS_MY_TURN: boolean;               // flag if it is my turn
    @Input() CLIENT_PLAYER_NUMBER: number;      // number of client


    handCards: MarketCard[] = MARKETCARDS;      // mock cards

    blueCards: MarketCard[] = [];                 // blue cards

    greenCards: MarketCard[] = [];                // green cards
    sortedGreenCards: MarketCard[][] = [];        // green cards sorted according to type

    purpleCards: MarketCard[] = [];               // purple cards


    currentPlayer: number;                       // current player number
    showBlueCardDetail: boolean = false;         // show the card if true
    showBlueCards: boolean = false;
    showGreenCardDetail: boolean = false;        // show the card if true
    showPurpleCardDetail: boolean = false;       // show the card if true
    canPlayCard: boolean = false;                 // show the card if true
    detailCard: MarketCard = new MarketCard();  // temporary card
    playableCardSelected: boolean = false;      // check if selected card can be played
    playButton: boolean = false;                 // check if play-button should be displayed

    constructor() {
    }

    ngOnInit() {
        this.arrangeHandCards(this.handCards);
    }


    // TODO: implement PLAY_BLUE_MARKET_CARD_MOVE, ServiceCall to move.service.ts and make move
    playCard(card: MarketCard) {
        console.log("playing Card :" + card.marketCardType);
    }


    // *************************************************************
    // HELPER FUNCTIONS FOR CARDS
    // *************************************************************
    // split all hand cards into 3 differend card stacks
    // blue, green, purple
    arrangeHandCards(handCards: MarketCard[]): void {
        // helper arrays
        let cards = handCards;
        let blueCards = [];
        let greenCards = [];
        let purpleCards = [];


        // loop trough hand cards and sort them
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].color == 'BLUE') {
                blueCards.push(cards[i]);
            }
            else if (cards[i].color == 'GREEN') {
                greenCards.push(cards[i]);
            }
            else if (cards[i].color == 'PURPLE') {
                purpleCards.push(cards[i]);
            }
        }

        // assign cards to local MarketCard[]
        this.blueCards = blueCards;
        this.greenCards = greenCards;
        this.purpleCards = purpleCards;

        this.sortGreenCards(this.greenCards);
    }

    // sorts the green cards and arranges them in separate arrays according to card type
    sortGreenCards(greenCards: MarketCard[]):void{
        /*
         *   BURIAL_CHAMBER_DECORATION
         *   OBELISK_DECORATION
         *   PYRAMID_DECORATION
         *   TEMPLE_DECORATION
         *
         * */

        let BURIAL_CHAMBER_DECORATION = [];
        let OBELISK_DECORATION = [];
        let PYRAMID_DECORATION = [];
        let TEMPLE_DECORATION = [];
        let sortedCardsArray:MarketCard[][]=[];

        // loop through cards and separate the types
        for(var i=0; i< greenCards.length; i++){
            if(greenCards[i].marketCardType == 'BURIAL_CHAMBER_DECORATION'){
                BURIAL_CHAMBER_DECORATION.push(this.greenCards[i]);
            }
            else if(greenCards[i].marketCardType == 'OBELISK_DECORATION'){
                OBELISK_DECORATION.push(this.greenCards[i]);
            }
            else if(greenCards[i].marketCardType == 'PYRAMID_DECORATION'){
                PYRAMID_DECORATION.push(this.greenCards[i]);
            }
            else if(greenCards[i].marketCardType == 'TEMPLE_DECORATION'){
                TEMPLE_DECORATION.push(this.greenCards[i]);
            }
        }

        sortedCardsArray.push(BURIAL_CHAMBER_DECORATION);
        sortedCardsArray.push(OBELISK_DECORATION);
        sortedCardsArray.push(PYRAMID_DECORATION);
        sortedCardsArray.push(TEMPLE_DECORATION);

        // push all card arrays
        this.sortedGreenCards = sortedCardsArray;
    }
    /***************************************************************/



    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    hasCard(cardType:string):boolean{
        return
    }

    //shows hovered card
    showCard(hoveredCard: MarketCard) {
        this.showBlueCardDetail = true;
        // only hide if click on same card, else don't hide and show other card
        if (this.detailCard == hoveredCard) {
            this.showBlueCardDetail = false;
        }
        this.detailCard = hoveredCard;
    }

    // hide card on mouseleave
    hideCard() {
        this.detailCard = null;
        this.showBlueCardDetail = false;
    }

    // show card detail of a playable card
    showPlayableCard(card: MarketCard) {
        this.playButton = false;

        this.showBlueCardDetail = !this.showBlueCardDetail;
        if(card != this.detailCard){
            this.detailCard = null;
            this.playButton = false;
            this.detailCard = card;
            this.showBlueCardDetail = true;
        }

        console.log("blurred: " + this.playButton);
    }

    // close the playable card
    closeCard() {
        this.showBlueCardDetail = false;
        this.playButton = false;
        this.detailCard = null;
    }

    // display button to click
    showPlayButton() {
        this.playButton = true;
        console.log("displayButton: "+ this.playButton);
    }

    // hide play button
    hidePlayButton() {
        this.playButton = false;
        console.log("hideButton: "+ this.playButton);
    }

    // show card detals of green and purple cards
    showCardDetails(color: string) {
        if (color == 'GREEN') {
            this.showGreenCardDetail = true;

        }else if(color == 'BLUE'){
            this.showBlueCards = true;
        }
        else {
            this.showPurpleCardDetail = true;
        }

    }

    // hide green or purple card details on mouseleave
    hideCardDetails() {
        this.showGreenCardDetail = false;
        this.showPurpleCardDetail = false;
        this.showBlueCards = false;

    }

    /*********************************************/
}
