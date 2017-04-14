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
  blueCards: MarketCard[]=[];                 // blue cards
  greenCards: MarketCard[]=[];                // green cards
  purpleCards: MarketCard[]=[];               // purple cards
  currentPlayer:number;                       // current player number
  showBlueCardDetail:boolean = false;         // show the card if true
  showGreenCardDetail:boolean = false;        // show the card if true
  showPurpleCardDetail:boolean = false;       // show the card if true
  canPlayCard:boolean =false;                 // show the card if true
  detailCard: MarketCard = new MarketCard();  // temporary card
  playableCardSelected: boolean = false;      // check if selected card can be played
  playButton:boolean = false;                 // check if play-button should be displayed

  constructor() {
  }

  ngOnInit() {
    this.arrangeHandCards(this.handCards);
  }


  // split all hand cards into 3 differend card stacks
  // blue, green, purple

  arrangeHandCards(handCards: MarketCard[]):void{
    // helper arrays
    let cards = handCards;
    let blueCards = [];
    let greenCards = [];
    let purpleCards = [];

    // loop trough hand cards and sort them
    for(var i=0; i<cards.length; i++) {
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
    }


  // TODO: implement PLAY_BLUE_MARKET_CARD_MOVE, ServiceCall to move.service.ts and make move
  playCard(card:MarketCard){
    console.log("playing Card :"+ card.marketCardType);
  }



  // *************************************************************
  // HELPER FUNCTIONS FOR UI
  // *************************************************************

  //shows hovered card
  showCard(hoveredCard:MarketCard){
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
  showPlayableCard(card:MarketCard){
    if(this.NR==this.CURRENTPLAYER){
      this.canPlayCard = true;
    }
    this.showBlueCardDetail = true;

    if (this.detailCard == card) {
      this.showBlueCardDetail = false;
    }
    this.detailCard = card;
  }

  // close the playable card
  closeCard(){
    this.showBlueCardDetail =false;
    this.playButton = false;
    this.detailCard = null;
  }

  // display button to click
  showPlayButton(){
    this.playButton = true;
  }

  // hide play button
  hidePlayButton(){
    this.playButton = false;
  }

  // show card detals of green and purple cards
  showCardDetails(color:string){
    if(color == 'GREEN'){
      this.showGreenCardDetail = true;

    }else{
      this.showPurpleCardDetail = true;
    }

  }

  // hide green or purple card details on mouseleave
  hideCardDetails(){
    this.showGreenCardDetail = false;
    this.showPurpleCardDetail = false;

  }
  /*********************************************/
}
