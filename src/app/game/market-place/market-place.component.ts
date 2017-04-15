import {Component, OnInit, Input, OnDestroy} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
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

export class MarketPlaceComponent implements OnInit, OnDestroy {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() IS_SUB_ROUND: boolean = false;
    @Input() IS_MY_SUB_ROUND_TURN: boolean = false;
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;

    // local storage data
    gameId: number;

    // component fields
    market: MarketPlace;
    cards: MarketCard[];
    marketPlaceId: number;      // market site ID to pass along to site-harbor

    showLargeCard: boolean = false;
    largeCard: MarketCard = new MarketCard();

    hasShipDocked: boolean = false;




    constructor(private marketPlaceService: MarketPlaceService) {

    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get the market card from the server
        this.updateMarketPlace();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateMarketPlace();
        }, this.timeoutInterval)
    }

    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    updateMarketPlace(): void {
        this.marketPlaceService.updateMarketCards(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    this.market = BuildingSite;
                    this.cards = this.market.marketCards;
                    this.marketPlaceId = BuildingSite.id;


                    // update harbor
                    this.hasShipDocked = BuildingSite.docked;
                    console.log("market: " + this.hasShipDocked);
                } else {
                    console.log("no games found");
                }
            })
    }

    // TODO: implement event "unload stones at market"
    pickCard(): void {

    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    displayRule(): void {
        // displays the rules popup
        let popup = document.getElementById("marketPlacePopup");
        popup.classList.toggle("show");
    }

    showlarge(clickedCard: MarketCard) {
        this.showLargeCard = true;
        // only hide if click on same card, else don't hide and show other card
        if (this.largeCard == clickedCard) {
            this.showLargeCard = false;
        }
        this.largeCard = clickedCard;
    }

    hideLargeCard() {
        this.showLargeCard = false;
    }
}
