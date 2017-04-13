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


  handCards: MarketCard[] = MARKETCARDS;
  playerNr:number;
  showCardDetail:boolean = false;
  detailCard: MarketCard = new MarketCard();

  constructor() {
  }

  ngOnInit() {
  }

  showCard(hoveredCard:MarketCard){
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


}
