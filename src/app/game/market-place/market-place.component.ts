import {Component, OnInit, Input, OnDestroy} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {MarketPlaceService} from "../../shared/services/market-place/market-place.service";
import {MoveService} from "../../shared/services/move/move.service";

// modules
import {Game} from '../../shared/models/game';
import {MarketPlace} from '../../shared/models/marketPlace';
import {MarketCard} from '../../shared/models/market-card';
import {GameComponent} from "../game.component";

@Component({
    selector: 'market-place',
    templateUrl: './market-place.component.html',
    styleUrls: ['./market-place.component.css'],
    providers: [MarketPlaceService, MoveService]
})

export class MarketPlaceComponent implements OnInit, OnDestroy {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() IS_SUB_ROUND: boolean = false;
    @Input() CURRENT_SUB_ROUND_PLAYER: number = 0;
    @Input() IS_MY_SUB_ROUND_TURN: boolean = false;
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;

    @Input() IS_PLAYING_CARD: boolean = false;
    @Input() CARD_ID: number = 0;
    @Input() CARD_TYPE: string = '';

    // local storage data
    gameId: number;
    playerNumber: number;

    // component fields
    market: MarketPlace;
    cards: MarketCard[];
    stagedCards: MarketCard[];
    marketPlaceId: number;      // market site ID to pass along to site-harbor
    cardsInitialised: boolean = false;
    showLargeCard: boolean = false;
    largeCard: MarketCard = new MarketCard();

    hasShipDocked: boolean = false;

    showPopUp: boolean = false;

    static saildShipId: number = 0;


    constructor(private marketPlaceService: MarketPlaceService,
                private moveService: MoveService) {

    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get player number and color from local storage
        let player = JSON.parse(localStorage.getItem('player'));

        // client player data from local storage player
        this.playerNumber = player.number;

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
                    // if page ir reloaded or not yet initialised
                    if (!this.cardsInitialised) {
                        this.stagedCards = BuildingSite.marketCards;
                        this.cards = BuildingSite.marketCards;
                        this.cardsInitialised = true;
                    }
                    // check for changes
                    this.compareChanges(BuildingSite.marketCards);
                    this.marketPlaceId = BuildingSite.id;


                    // update harbor
                    this.hasShipDocked = BuildingSite.docked;
                } else {
                    console.log("no games found");
                }
            })
    }

    // checks cards for changes
    compareChanges(marketCards: MarketCard[]): void {
        let changesMade: boolean = false;

        if (marketCards.length > 0) {
            for (var i = 0; i < marketCards.length; i++) {
                if (marketCards[i].id != this.stagedCards[i].id) {
                    changesMade = true;
                    break;
                }
            }
            // if there are changes update the displayed cards
            if (changesMade) {
                console.log("changes made to cards");
                this.cards = marketCards;
                this.stagedCards = marketCards;
            }
        }
    }

    pickCard(cardId: number): void {
        this.moveService.getCard(
            this.gameId, this.ROUND, this.playerNumber,
            cardId
        ).subscribe(response => {
            if (response) {
                // TODO: handle response (currently Observable<string> might change)
            } else {
                console.log("supplySled data error");
            }
        });
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    showlarge(clickedCard: MarketCard) {
        this.showLargeCard = true;
        // only hide if click on same card, else don't hide and show other card
        if (this.largeCard == clickedCard) {
            this.largeCard = null;
            this.showLargeCard = false;
        }
        this.largeCard = clickedCard;
    }

    hideLargeCard() {
        this.largeCard = null;
        this.showLargeCard = false;
    }
}
