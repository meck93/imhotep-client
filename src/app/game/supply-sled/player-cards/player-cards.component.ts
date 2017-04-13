import {Component, OnInit, Input} from '@angular/core';
import {MarketCard} from "../../../shared/models/market-card";
import {MARKETCARDS} from "../../../shared/models/mock-cards";


// others
let $ = require('../../../../../node_modules/jquery/dist/jquery.slim.js');
declare let jQuery: any;

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

  constructor() {
  }

  ngOnInit() {
    this.playerNr = this.NR;
    console.log(this.playerNr);
    console.log(this.handCards);
  }

  showCard(card:MarketCard){

  }

}
