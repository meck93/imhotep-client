import {Component, OnInit} from '@angular/core';
import {MarketCard} from '../../shared/models/market-card';
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

  private timoutInterval: number = 3000;
  private timoutId: Timer;

  constructor(private marketPlaceService: MarketPlaceService) { }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('currentGame'));
    this.updateMarketcards();

    var that = this;
    this.timoutId = setInterval(function () {
      that.updateMarketcards();
    }, this.timoutInterval)
  }

  displayRule():void{
    // displays the rules popup
    var popup = document.getElementById("marketPlacePopup");
    popup.classList.toggle("show");
  }

  //TODO: implement event "unload stones at market"
  takeCard():void{ }

  updateMarketcards():void{
    this.marketPlaceService.updateMarketCards(this.game.id)
        .subscribe(BuildingSite => {
          if (BuildingSite) {
            // updates the stones array in this component
            this.market = BuildingSite;
            this.cards = this.market.marketCards;
          } else {
            console.log("no games found");
          }
        })
  }

}
