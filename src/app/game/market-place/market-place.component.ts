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
    marketPlaceId: number;      // market site ID to pass along to site-harbor

    showLargeCard: boolean = false;
    largeCard: MarketCard = new MarketCard();

    hasShipDocked: boolean = false;

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
                    this.cards = this.market.marketCards;
                    this.marketPlaceId = BuildingSite.id;


                    // update harbor
                    this.hasShipDocked = BuildingSite.docked;
                } else {
                    console.log("no games found");
                }
            })
    }

    pickCard(cardId: number): void {
        this.moveService.getCard(
            this.gameId, this.ROUND, this.playerNumber,
            cardId
        ).subscribe(response => {
            if (response) {
                // TODO: handle response (currently Observable<string> might change)
            } else {
                console.log("supply sled data error");
            }
        });
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
