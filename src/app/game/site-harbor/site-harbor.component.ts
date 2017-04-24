import {Component, OnInit, Input, OnChanges} from '@angular/core';

// services
import {MoveService} from "../../shared/services/move/move.service";
import {Ship} from "../../shared/models/ship";
import {ShipComponent} from "../ship/ship.component";
import {MarketPlace} from "../../shared/models/marketPlace";
import {MarketPlaceComponent} from "../market-place/market-place.component";

// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');
declare let jQuery: any;

@Component({
    selector: 'site-harbor',
    templateUrl: './site-harbor.component.html',
    styleUrls: ['./site-harbor.component.css'],
    providers: [MoveService]
})
export class SiteHarborComponent implements OnInit, OnChanges {
    // inputs
    @Input() HAS_DOCKED_SHIP;     // information if ship has docked on parent-site
    @Input() ORIENTATION: string; // either 'vertical' or 'horizontal'
    @Input() SITE_ID: number;      // ID of parent site
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;

    @Input() IS_PLAYING_CARD: boolean = false;
    @Input() CARD_ID: number = 0;
    @Input() CARD_TYPE: string = '';

    hasDockedShip: boolean = false;
    hasUpdated: boolean = false;
    isDragOver: boolean = false;
    round: number = 0;

    receivedObject: any;

    constructor(private moveService: MoveService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hasUpdated = this.hasDockedShip != this.HAS_DOCKED_SHIP;
        this.hasDockedShip = this.HAS_DOCKED_SHIP;

        if (this.round != this.ROUND) {
            this.HAS_DOCKED_SHIP = false;
            this.hasDockedShip = false;
        }

        this.round = this.ROUND;
    }

    // SAIL SHIP MOVE
    // is triggered when a ship is dropped inside the droppable-zone
    sailShipToSite(): void {
        // make normal ship move is no marked card was played
        console.log("IS_PLAYING_CARD");
        console.log(this.IS_PLAYING_CARD);
        if (!this.IS_PLAYING_CARD) {
            this.moveService.sailShipToSite(this.receivedObject.gameId,
                this.receivedObject.roundNr,
                this.receivedObject.playerNr,
                this.receivedObject.shipId,
                this.SITE_ID)
                .subscribe(response => {
                    //TODO: catch error
                    console.log(response);
                });
        } else {
            // make SAIL market card move
            if (this.CARD_TYPE == 'SAIL') {
                // information needed for the request
                // gameId: number, roundNr: number, playerNr: number,
                // cardId: number, cardType: string,
                // shipId: number, placeOnShip: number,
                // targetSiteId: number
                this.moveService.playMarketCard_SAIL(
                    this.receivedObject.gameId, this.ROUND, this.receivedObject.playerNumber,
                    this.CARD_ID, this.CARD_TYPE,
                    this.receivedObject.ID, ShipComponent.firstPlaceOnShip,
                    this.SITE_ID)
                    .subscribe(response => {
                        if (response) {
                            console.log("playing Card: " + this.CARD_TYPE);

                            ShipComponent.firstShipId = 0;
                            ShipComponent.firstPlaceOnShip = 0;
                        } else {
                            console.log("supply sled data error");
                        }
                    });
            }
            // call lever-card function in moveService
            else if(this.CARD_TYPE == 'LEVER'){
                 this.moveService.playMarketCard_LEVER(
                     this.receivedObject.gameId,
                     this.ROUND,
                     this.receivedObject.playerNr,
                     this.CARD_ID,
                     this.CARD_TYPE,
                     this.receivedObject.shipId,
                     this.receivedObject.unloadingOrder,
                     this.SITE_ID)
                     .subscribe(response => {
                         if (response) {
                             console.log("playing Card: " + this.CARD_TYPE);
                         } else {
                             console.log("supply sled data error");
                         }
                     });
            }
        }
    }

    transferDataSuccess(event) {
        this.HAS_DOCKED_SHIP = true;
        this.hasDockedShip = true;

        // parse received data into object
        this.receivedObject = JSON.parse(event.dragData);
        let x = this.receivedObject.shipId;
        // hide sailed ship if it was dropped successfully
        $('#ship' + x).hide();
        // hide LEVER sorting div after ship was dropped
        $('#detailShipLeverMove').hide();
        this.isDragOver = false;
        // make the sail move
        this.sailShipToSite();

        // for getCard in sub round
        MarketPlaceComponent.saildShipId = x;
        console.log(x);
    }

    allowDrop(): boolean {
        return this.hasDockedShip === true;
    }

    onDragOver() {
        if (!this.hasDockedShip) {
            this.isDragOver = true;
        }
    }

    onDragExit() {
        this.isDragOver = false;
    }

}
