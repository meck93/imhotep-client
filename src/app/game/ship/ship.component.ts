import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ShipService} from '../../shared/services/ship/ship.service';
import {MoveService} from '../../shared/services/move/move.service';
import {SupplySledService} from '../../shared/services/supply-sled/supply-sled.service';

// models
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';
import {DraggableComponent} from "ng2-dnd";


@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css'],
    providers: [ShipService, MoveService, SupplySledService, DraggableComponent]
})

export class ShipComponent implements OnInit {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() ID: number;                            // the ship id to determine which ship to show
    @Input() ROUND: number;                         // the current round of the game
    @Input() IS_SUB_ROUND: boolean = false;         // flag if subround is in progress
    @Input() IS_MY_TURN: boolean = false;
    @Input() IS_MY_SUBROUND_TURN: boolean = false;

    // INPUT DATA FOR THE PLAY MARKET CARD MOVE
    @Input() IS_PLAYING_CARD: boolean = false;
    @Input() CARD_ID: number;
    @Input() CARD_TYPE: string;

    // outputs
    @Output() SHIP_WANTS_TO_SAIL = new EventEmitter();

    // local storage data
    gameId: number;                             // the game id
    playerNumber: number;                       // the player number (1-4) of this player

    // component fields
    ship: Ship;                                 // the ship with all data from the server
    stones: Stone[] = [];                       // the stones of this ship
    init: boolean = true;                       // boolean to check if ship (divs for place and little stones) is already initialized
    places = [];                                // just needed to generate stone places on the middle on the ship
    littleStones = [];                          // just needed to generate little stones in the front of the ship
    hasSupplySledStones: boolean;               // boolean to check if the supply sled of this player has stones to place on the ship
    hasShipUpdated: boolean[] = [];             // boolean to check if the ship has updated since the last polling and show changes to the user
    localRoundCounter: number = this.ROUND;     // component round variable

    // drag n drop functionalities and variables
    transferData: String = "";
    isDragged: boolean = false;
    isDropped: boolean = false;

    constructor(private shipService: ShipService,
                private moveService: MoveService,
                private supplySledService: SupplySledService) {
    }

    // initialize component
    ngOnInit() {
        // get player number from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.playerNumber = player.number;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get all ship data from the service and initially create the ship
        this.updateShip(this.gameId, this.ROUND, this.ID);
        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            if (that.ROUND != 0) {
                that.localRoundCounter = that.ROUND; // keep track of roundCounter locally
            }
            that.updateShip(that.gameId, that.ROUND, that.ID);
            that.updateSupplySled();
        }, this.timeoutInterval);
    }

    // is called before ngOnInit if changes have been made to the @Input values
    ngOnChanges() {
        if (this.ROUND > this.localRoundCounter) {
            // trigger the component to create a new ship at next updateShip()
            this.init = true;

            // reset local ship
            this.ship = null;

            // reset local stones
            this.stones = null;
        }

        // added communication between playerCards.component and ship.components
        // FOR DEBUG ONLY
        console.log("____________________________");
        console.log("SHIP SAYS:");
        console.log(this.IS_PLAYING_CARD);
        console.log(this.CARD_ID);
        console.log(this.CARD_TYPE);
        console.log("____________________________");

    }


    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // get ship with ID
    updateShip(gameId: number, roundNumber: number, shipId: number): void {
        if (roundNumber != 0) {
            this.shipService.getShip(gameId, roundNumber, shipId).subscribe(
                (ship) => {
                    this.ship = ship;

                    // data to transfer to the site-harbor if the ship is sailed to a site
                    this.transferData = JSON.stringify({
                        gameId: this.gameId,
                        roundNr: this.ROUND,
                        playerNr: this.playerNumber,
                        shipId: this.ID
                    });


                    let stones: Stone[] = [];

                    // init stone array
                    for (let i = 0; i < this.ship.MAX_STONES; i++) {
                        stones.push(undefined);
                    }

                    // get number of stones placed on the ship
                    let numberOfStones = this.ship.stones.length;

                    // place stones from received ship to local array
                    for (let i = 0; i < numberOfStones; i++) {
                        stones[this.ship.stones[i].placeOnShip - 1] = this.ship.stones[i];
                    }

                    // check whether there were some changes since the last polling
                    for (let i = 0; i < this.ship.MAX_STONES; i++) {
                        // only check place i if there is a stone
                        if (stones[i] != undefined) {
                            this.hasShipUpdated[i] = this.stones[i] == undefined;
                        } else {
                            this.hasShipUpdated[i] = false;
                        }
                    }

                    // save received stones
                    this.stones = stones;

                    // create divs for stones if ship is initializing
                    if (this.init) {
                        this.init = false;
                        this.createShip();
                    }
                });
        }
    }

    // get newest supply sled data from server and check whether there are stones to place on the ship
    updateSupplySled(): void {
        this.supplySledService.updateSupplySledStones(this.gameId, this.playerNumber)
            .subscribe(playerData => {
                if (playerData) {
                    // check if there are stones on the sled
                    this.hasSupplySledStones = playerData.supplySled.stones.length > 0;
                } else {
                    console.log("supply sled data error");
                }
            })
    }

    // set stone on a specified place on the ship
    //
    setStone(number: number) {
        // check if it is this players turn,
        // the ship has not sailed yet and
        // the specified place is not already occupied
        if (!this.IS_SUB_ROUND && this.IS_MY_TURN && !this.ship.hasSailed && !this.isOccupied(number)) {
            // this.ship.stones[number].color = this.userColor;

            // check if a the blue market card HAMMER was played
            if (this.IS_PLAYING_CARD && this.CARD_TYPE == 'HAMMER') {
                this.moveService.playMarketCard_HAMMER(
                    this.gameId,
                    this.ROUND,
                    this.playerNumber,
                    this.CARD_ID, this.CARD_TYPE,
                    this.ID,
                    ++number,
                ).subscribe(response => {
                    if (response) {
                        console.log("playing Card: " + this.CARD_TYPE);
                    } else {
                        console.log("supply sled data error");
                    }
                });
            } else {
                // make normal place stone move
                this.moveService.placeStone(this.gameId, this.ROUND, this.playerNumber, this.ID, ++number)
                    .subscribe(response => {
                        //TODO: catch error of request response
                        console.log(response);
                    });
            }
        }
    }

    // sails ship to sea (make it smaller and add some left margin)
    // actual move is done via dragging the ship (call is fired at site harbor)
    sail() {
        if (this.IS_MY_TURN) {
            this.ship.hasSailed = true;
        }
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // create divs for stones
    createShip() {
        // create temporary array to hold the ship data
        let places = [];
        let littleStones = [];
        let hasShipUpdated = [];

        // initialize place divs on ship
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            let place = {id: i};
            places.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < this.ship.MIN_STONES; i++) {
            let littleStone = {id: i.toString()};
            littleStones.push(littleStone);
        }

        // initialize change variable to ship size
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            hasShipUpdated.push(false);
        }

        // set the data to the ship attributes
        // or replace them if they already exist
        this.places = places;
        this.littleStones = littleStones;
        this.hasShipUpdated = hasShipUpdated;
    }

    // check whether this place is already occupied (stone is placed) or not
    isOccupied(place: number) {
        if (this.stones[place] != undefined) {
            return this.stones[place].color != '';
        }

        return false;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    // check whether the ship is ready to sail or not
    isReadyToSail() {
        let numberOfStones = 0;

        // count all stones placed on the ship
        for (let i = 0; i < this.ship.MAX_STONES; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }

        // return whether the minimum placed stones to sail the ship are reached
        return numberOfStones >= this.ship.MIN_STONES;
    }

    onShipDrag() {
        this.isDragged = true;
        this.SHIP_WANTS_TO_SAIL.emit(this.isDragged);
    }

    onDragExit() {
        this.isDragged = false;
        this.isDropped = false;
        this.SHIP_WANTS_TO_SAIL.emit(this.isDragged);
    }

    onDrop() {
        this.isDropped = true;
        this.isDragged = false;
    }
}
