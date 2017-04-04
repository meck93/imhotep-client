import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MarketCard} from '../../shared/models/market-card';
import {MARKETCARDS} from '../../shared/models/mock-market-cards';
import {Game} from '../../shared/models/game';
import {MarketPlace} from '../../shared/models/marketPlace';
import Timer = NodeJS.Timer;
import {MarketPlaceService} from "../../shared/services/market-place/market-place.service";

@Component({
  selector: 'market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.css'],
  providers: [MarketPlaceService]
})
export class MarketPlaceComponent implements OnInit {
  game:Game;
  market: MarketPlace;
  cards:MarketCard[];

  constructor(private marketPlaceService: MarketPlaceService) { }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('currentGame'));
    this.cards = MARKETCARDS;
  }

  displayRule():void{
    // displays the rules popup
    var popup = document.getElementById("marketPlacePopup");
    popup.classList.toggle("show");
  }

  //TODO: implement event "unload stones at market"
  takeCard():void{ }

}
