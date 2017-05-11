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
    localRoundCounter: number;

    // component fields
    market: MarketPlace;
    cards: MarketCard[] = [];
    stagedCards: MarketCard[];
    marketPlaceId: number;                          // market site ID to pass along to site-harbor
    cardsInitialised: boolean = false;
    showLargeCard: boolean = false;
    largeCard: MarketCard = new MarketCard();

    hasShipDocked: boolean = false;
    hasCardUpdated: boolean[] = [false, false, false, false];

    showPopUp: boolean = false;

    errorMessage: string;                   // holds error message

    static saildShipId: number = 0;

    static alreadyInit: boolean = false;


    constructor(private marketPlaceService: MarketPlaceService,
                private moveService: MoveService) {

    }

    // *************************************************************
    // MAIN FUNCTIONS
    // *************************************************************

    ngOnInit() {
        // ensure that component only initializes once
        if (MarketPlaceComponent.alreadyInit) {
            return;
        }
        MarketPlaceComponent.alreadyInit = true;

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
            that.localRoundCounter = that.ROUND;
        }, this.timeoutInterval)
    }

    ngOnChanges() {
        if (this.localRoundCounter != this.ROUND) {
            this.cardsInitialised = false;
        }
    }

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
                        this.saveCards(BuildingSite.marketCards);
                        this.cardsInitialised = true;
                    }
                    // check for changes
                    this.compareChanges(BuildingSite.marketCards);
                    this.marketPlaceId = BuildingSite.id;


                    // update harbor
                    this.hasShipDocked = BuildingSite.docked;
                }
            }, error => this.errorMessage = <any>error);
    }

    // pick a card from the market place
    pickCard(cardId: number): void {
        this.moveService.getCard(
            this.gameId, this.ROUND, this.playerNumber,
            cardId
        ).subscribe(response => {
            if (response) {
                this.showLargeCard = false;
            }
        }, error => this.errorMessage = <any>error);
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // checks cards for changes
    compareChanges(marketCards: MarketCard[]): void {
        let changesMade: boolean = false;

        if (marketCards.length == 0) {
            this.saveCards(marketCards);
        }

        if (marketCards.length < this.stagedCards.length) {
            changesMade = true;
        }

        this.saveCards(marketCards);

        // if there are changes update the displayed cards
        if (changesMade) {
            this.stagedCards = marketCards;
        }
    }

    // save market cards to corresponding place
    saveCards(cards: MarketCard[]): void {
        // place every card on the corresponding place
        let marketPlaceCards: MarketCard[] = [undefined, undefined, undefined, undefined];
        for (let i = 0; i < cards.length; i++) {
            marketPlaceCards[cards[i].positionOnMarketPlace - 1] = cards[i];
        }

        for (let i = 0; i < marketPlaceCards.length; i++) {
            // check if there was a change
            let cardWasHere = this.cards[i] != undefined;
            let cardIsHere = marketPlaceCards[i] != undefined;
            this.hasCardUpdated[i] = cardWasHere != cardIsHere;
        }
        this.cards = marketPlaceCards;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // show the large card
    showlarge(clickedCard: MarketCard) {
        this.showLargeCard = true;
        // only hide if click on same card, else don't hide and show other card
        if (this.largeCard == clickedCard) {
            this.largeCard = null;
            this.showLargeCard = false;
        }
        this.largeCard = clickedCard;
    }

    // hide the large card
    hideLargeCard() {
        this.largeCard = null;
        this.showLargeCard = false;
    }
}
