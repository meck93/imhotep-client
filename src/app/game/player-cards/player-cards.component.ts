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
  @Input() CARDS: MarketCard[];     // hand cards of this player
  @Input() NR: number;
  @Input() CURRENTPLAYER: number;


  handCards: MarketCard[] = MARKETCARDS;
  playerNr:number;
  currentPlayer:number;
  showCardDetail:boolean = false;
  canPlayCard:boolean =false;
  detailCard: MarketCard = new MarketCard();
  playableCardSelected: boolean = false;
  playButton:boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.playerNr = this.NR;
    this.currentPlayer = this.CURRENTPLAYER;
  }

  showCard(hoveredCard:MarketCard){
    if(this.NR==this.CURRENTPLAYER){
      this.canPlayCard = true;
    }
    this.showCardDetail = true;
    // only hide if click on same card, else don't hide and show other card
    if (this.detailCard == hoveredCard) {
      this.showCardDetail = false;
    }
    this.detailCard = hoveredCard;
  }

  hideCard() {
    this.detailCard = null;
    this.showCardDetail = false;
  }

  showPlayableCard(card:MarketCard){
    if(this.NR==this.CURRENTPLAYER){
      this.canPlayCard = true;
    }
    this.showCardDetail = true;
    // only hide if click on same card, else don't hide and show other card
    if (this.detailCard == card) {
      this.showCardDetail = false;
    }
    this.detailCard = card;
  }

  closeCard(){
    this.showCardDetail =false;
    this.playButton = false;
    this.detailCard = null;
  }

  playCard(card:MarketCard){
    console.log("playing Card :"+ card.marketCardType);
  }

  showPlayButton(){
    this.playButton = true;
  }

  hidePlayButton(){
    this.playButton = false;
  }




}
