import {Component, OnInit} from '@angular/core';

// polling
import Timer = NodeJS.Timer;

// services
import {MarketPlaceService} from "../../shared/services/market-place/market-place.service";

// modules
import {Game} from '../../shared/models/game';
import {MarketPlace} from '../../shared/models/marketPlace';
import {MarketCard} from '../../shared/models/market-card';

@Component({
    selector: 'market-place',
    templateUrl: './market-place.component.html',
    styleUrls: ['./market-place.component.css'],
    providers: [MarketPlaceService]
})

export class MarketPlaceComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = 3000;

    gameId: number;
    market: MarketPlace;
    cards: MarketCard[];


    constructor(private marketPlaceService: MarketPlaceService) {
    }

    ngOnInit() {
        // #newWay
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        this.updateMarketcards();

        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateMarketcards();
        }, this.timeoutInterval)
    }

    displayRule(): void {
        // displays the rules popup
        let popup = document.getElementById("marketPlacePopup");
        popup.classList.toggle("show");
    }

    //TODO: implement event "unload stones at market"
    takeCard(): void {
    }

    updateMarketcards(): void {
        this.marketPlaceService.updateMarketCards(this.gameId)
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
