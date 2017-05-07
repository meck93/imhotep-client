import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {PlayerService} from '../../shared/services/player/player.service';

// models
import {MarketCard} from "../../shared/models/market-card";

// data
import {MARKETCARDS} from "../../shared/models/mock-cards";


@Component({
    selector: 'player-cards',
    templateUrl: 'player-cards.component.html',
    styleUrls: ['player-cards.component.css'],
    providers: [PlayerService]
})
export class PlayerCardsComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() CARDS: MarketCard[];               // hand cards of this player
    @Input() NR: number;                        // number of the player
    @Input() CURRENTPLAYER: number;             // number of current player
    @Input() IS_MY_TURN: boolean;               // flag if it is my turn
    @Input() CLIENT_PLAYER_NUMBER: number;      // number of client
    @Input() ROUND_NR: number;
    @Input() IS_ANOTHER_CARD_BEEING_PLAYED: boolean;
    @Input() NUMBER_OF_STONES_ON_SLED: number = 0;
    @Input() NUMBER_OF_FREE_SHIPS_PLACES: number = 0;
    @Input() NUMBER_OF_SHIPS_READY_TO_SAIL: number = 0;

    // OUTPUT DATA FOR THE PLAY MARKET CARD MOVE
    @Output() IS_PLAYING_CARD = new EventEmitter<boolean>();    // emits if a market card is being played
    @Output() CARD_ID = new EventEmitter<number>();             // emits the card-id of the played market card
    @Output() CARD_TYPE = new EventEmitter<string>();           // emits the card-type of the played market card

    gameId: number;

    handCards: MarketCard[] = MARKETCARDS;          // mock cards
    blueCards: MarketCard[] = [];                   // blue cards
    greenCards: MarketCard[] = [];                  // green cards
    sortedGreenCards: MarketCard[][] = [];          // green cards sorted according to type
    sortedBlueCards: MarketCard[][] = [];           // blue cards sorted according to type
    purpleCards: MarketCard[] = [];                 // purple cards

    currentPlayer: number;                          // current player number
    showBlueCardDetail: boolean = false;            // show the card if true
    showBlueCards: boolean = false;
    showGreenCardDetail: boolean = false;           // show the card if true
    showPurpleCardDetail: boolean = false;          // show the card if true
    canPlayCard: boolean = false;                   // show the card if true
    detailCard: MarketCard = new MarketCard();      // temporary card
    playableCardSelected: boolean = false;          // check if selected card can be played
    playButton: boolean = false;                    // check if play-button should be displayed
    hoveredMarketCardType:string = '';

    isPlayingCard: boolean = false;

    constructor(private playerService: PlayerService) {
    }

    ngOnInit() {
        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        //this.arrangeHandCards(this.handCards);

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            // update stones on the supplySled
            that.updatePlayerCards();
        }, this.timeoutInterval)
    }

    // checks for changes of the @Input() variables
    ngOnChanges() {
        // if it is not my turn
        if (!this.IS_MY_TURN) {
            // set local variale to false, as it is not my turn
            this.isPlayingCard = false;
            // start emitting that I am unable to play a market card
            this.exitCardMove();
            // hide card details
            this.closeCard()
        }
    }

    // emits all needed date for a market card to be played
    // is passed to the ship.component
    playCard(card: MarketCard) {
        this.showBlueCards =false;
        this.isPlayingCard = true;
        this.IS_PLAYING_CARD.emit(this.isPlayingCard);
        this.CARD_ID.emit(card.id);
        this.CARD_TYPE.emit(card.marketCardType);

        this.closeCard();
    }

    // emits that I cannot play a market card at the moment, as it is not my turn
    exitCardMove() {
        this.IS_PLAYING_CARD.emit(this.isPlayingCard);
        this.CARD_ID.emit(0);
        this.CARD_TYPE.emit("");
    }

    updatePlayerCards(): void {
        this.playerService.getPlayer(this.gameId, this.NR)
            .subscribe(playerData => {
                if (playerData) {
                    let cards = playerData.handCards;
                    this.handCards = cards;
                    this.arrangeHandCards(cards);
                } else {
                    console.log("player data error");
                }
            });
    }


    // *************************************************************
    // HELPER FUNCTIONS FOR CARDS
    // *************************************************************
    // split all hand cards into 3 differend card stacks
    // blue, green, purple
    arrangeHandCards(handCards: MarketCard[]): void {
        // helper arrays
        let cards = handCards;
        let blueCards = [];
        let greenCards = [];
        let purpleCards = [];

        // loop trough hand cards and sort them
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].color == 'BLUE') {
                blueCards.push(cards[i]);
            }
            else if (cards[i].color == 'GREEN') {
                greenCards.push(cards[i]);
            }
            else if (cards[i].color == 'VIOLET') {
                purpleCards.push(cards[i]);
            }
        }

        // assign cards to local MarketCard[]
        this.blueCards = blueCards;
        this.greenCards = greenCards;
        this.purpleCards = purpleCards;

        this.sortGreenCards(this.greenCards);
        this.sortBlueCards(this.blueCards);
    }

    // sorts the green cards and arranges them in separate arrays according to card type
    sortGreenCards(greenCards: MarketCard[]): void {
        /*
         *   BURIAL_CHAMBER_DECORATION
         *   OBELISK_DECORATION
         *   PYRAMID_DECORATION
         *   TEMPLE_DECORATION
         *
         * */

        let BURIAL_CHAMBER_DECORATION = [];
        let OBELISK_DECORATION = [];
        let PYRAMID_DECORATION = [];
        let TEMPLE_DECORATION = [];
        let sortedCardsArray: MarketCard[][] = [];

        // loop through cards and separate the types
        for (var i = 0; i < greenCards.length; i++) {
            if (greenCards[i].marketCardType == 'BURIAL_CHAMBER_DECORATION') {
                BURIAL_CHAMBER_DECORATION.push(this.greenCards[i]);
            }
            else if (greenCards[i].marketCardType == 'OBELISK_DECORATION') {
                OBELISK_DECORATION.push(this.greenCards[i]);
            }
            else if (greenCards[i].marketCardType == 'PYRAMID_DECORATION') {
                PYRAMID_DECORATION.push(this.greenCards[i]);
            }
            else if (greenCards[i].marketCardType == 'TEMPLE_DECORATION') {
                TEMPLE_DECORATION.push(this.greenCards[i]);
            }
        }

        sortedCardsArray.push(BURIAL_CHAMBER_DECORATION);
        sortedCardsArray.push(OBELISK_DECORATION);
        sortedCardsArray.push(PYRAMID_DECORATION);
        sortedCardsArray.push(TEMPLE_DECORATION);

        // push all card arrays
        this.sortedGreenCards = sortedCardsArray;
    }

    // sorts the green cards and arranges them in separate arrays according to card type
    sortBlueCards(blueCards: MarketCard[]): void {
        /*
         *   HAMMER
         *   LEVER
         *   CHISEL
         *   SAIL
         *
         * */

        let HAMMER = [];
        let LEVER = [];
        let CHISEL = [];
        let SAIL = [];
        let sortedCardsArray: MarketCard[][] = [];

        // loop through cards and separate the types
        for (var i = 0; i < blueCards.length; i++) {
            if (blueCards[i].marketCardType == 'HAMMER') {
                HAMMER.push(this.blueCards[i]);
            }
            else if (blueCards[i].marketCardType == 'LEVER') {
                LEVER.push(this.blueCards[i]);
            }
            else if (blueCards[i].marketCardType == 'CHISEL') {
                CHISEL.push(this.blueCards[i]);
            }
            else if (blueCards[i].marketCardType == 'SAIL') {
                SAIL.push(this.blueCards[i]);
            }
        }

        sortedCardsArray.push(HAMMER);
        sortedCardsArray.push(LEVER);
        sortedCardsArray.push(CHISEL);
        sortedCardsArray.push(SAIL);

        // push all card arrays
        this.sortedBlueCards = sortedCardsArray;
    }

    /***************************************************************/


    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    //shows hovered card
    showCard(hoveredCard: MarketCard) {
        this.showBlueCardDetail = true;
        // only hide if click on same card, else don't hide and show other card
        if (this.detailCard == hoveredCard) {
            this.showBlueCardDetail = false;
        }
        this.detailCard = hoveredCard;
    }

    // hide card on mouseleave
    hideCard() {
        this.detailCard = null;
        this.showBlueCardDetail = false;
    }

    // show card detail of a playable card
    showPlayableCard(card: MarketCard) {
        this.showBlueCards = false;
        this.playButton = false;

        this.showBlueCardDetail = !this.showBlueCardDetail;
        if (card != this.detailCard) {
            this.detailCard = null;
            this.playButton = false;
            this.detailCard = card;
            this.showBlueCardDetail = true;
        }

    }

    // close the playable card
    closeCard() {
        this.showBlueCardDetail = false;
        this.playButton = false;
        //this.detailCard = null;
    }

    // display button to click
    showPlayButton(marketCardType: string) {
        this.hoveredMarketCardType = marketCardType
        // only allow playing a card if no other card is played
        if (!this.IS_ANOTHER_CARD_BEEING_PLAYED) {
            switch (marketCardType) {
                case 'CHISEL':
                    // don't allow playing the chisel card if there are not at least two stones on the sled and if there are not at least two free places on any ship
                    if (this.NUMBER_OF_STONES_ON_SLED < 2 || this.NUMBER_OF_FREE_SHIPS_PLACES < 2) {
                        this.playButton = false;
                    } else {
                        this.playButton = true;
                    }

                    break;

                case 'HAMMER':
                    // don't allow playing the hammer card if there is not at least one free place on any ship
                    if (this.NUMBER_OF_FREE_SHIPS_PLACES < 1) {
                        this.playButton = false;
                    } else {
                        this.playButton = true;
                    }
                    break;

                case 'SAIL':
                    // don't allow playing the sail card if there is not at least one stone on the sled
                    if (this.NUMBER_OF_STONES_ON_SLED < 1) {
                        this.playButton = false;
                    } else {
                        this.playButton = true;
                    }
                    break;

                case 'LEVER':
                    // don't allow playing the lever card if there is not ship ready to sail
                    if (this.NUMBER_OF_SHIPS_READY_TO_SAIL < 1) {
                        this.playButton = false;
                    } else {
                        this.playButton = true;
                    }

                    break;
            }
        }
    }

    // returns if a card is able to be played with the given resources of the player
    isCardPlayable(marketCardType: string):boolean{
        let playable: boolean = false;
        switch (marketCardType) {
            case 'CHISEL':
                // don't allow playing the chisel card if there are not at least two stones on the sled and if there are not at least two free places on any ship
                if (this.NUMBER_OF_STONES_ON_SLED < 2 || this.NUMBER_OF_FREE_SHIPS_PLACES < 2) {
                    playable = false;
                } else {
                    playable = true;
                }

                break;

            case 'HAMMER':
                // don't allow playing the hammer card if there is not at least one free place on any ship
                if (this.NUMBER_OF_FREE_SHIPS_PLACES < 1) {
                    playable = false;
                } else {
                    playable = true;
                }
                break;

            case 'SAIL':
                // don't allow playing the sail card if there is not at least one stone on the sled
                if (this.NUMBER_OF_STONES_ON_SLED < 1 || this.NUMBER_OF_FREE_SHIPS_PLACES < 1) {
                    playable = false;
                } else {
                    playable = true;
                }
                break;

            case 'LEVER':
                // don't allow playing the lever card if there is not ship ready to sail
                if (this.NUMBER_OF_SHIPS_READY_TO_SAIL < 1) {
                    playable = false;
                } else {
                    playable = true;
                }
                break;
        }
        return playable;
    }

    // hide play button
    hidePlayButton() {
        this.playButton = false;
    }

    // show card detals of green and purple cards
    showCardDetails(color: string) {
        if (color == 'GREEN') {
            this.showGreenCardDetail = true;

        } else if (color == 'BLUE') {
            this.showBlueCards = true;
        }
        else {
            this.showPurpleCardDetail = true;
        }

    }

    // hide green or purple card details on mouseleave
    hideCardDetails() {
        this.showGreenCardDetail = false;
        this.showPurpleCardDetail = false;
        this.showBlueCards = false;

    }

    /*********************************************/
}
