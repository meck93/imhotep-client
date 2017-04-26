import {Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {ShipService} from '../../shared/services/ship/ship.service';
import {MoveService} from '../../shared/services/move/move.service';
import {PlayerService} from '../../shared/services/player/player.service';

// models
import {Ship} from '../../shared/models/ship';
import {Stone} from '../../shared/models/stone';
import {DraggableComponent} from "ng2-dnd";

// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');

@Component({
    selector: 'ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.css'],
    providers: [ShipService, MoveService, PlayerService, DraggableComponent]
})

export class ShipComponent implements OnInit, OnChanges {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() ID: number;                            // the ship id to determine which ship to show
    @Input() ROUND: number;                         // the current round of the game
    @Input() IS_SUB_ROUND: boolean = false;         // flag if sub round is in progress
    @Input() IS_MY_TURN: boolean = false;
    @Input() IS_MY_SUBROUND_TURN: boolean = false;

    // INPUT DATA FOR THE PLAY MARKET CARD MOVE
    @Input() IS_PLAYING_CARD: boolean = false;      // flag if player is playing a market card
    @Input() CARD_ID: number = 0;                   // card-id of the played market card
    @Input() CARD_TYPE: string = "";                // card-type of the played market card

    // outputs
    @Output() SHIP_WANTS_TO_SAIL = new EventEmitter();

    // local storage data
    gameId: number;                             // the game id
    playerNumber: number;                       // the player number (1-4) of this player
    playerColor: string;                        // the color of this player

    // component fields
    ship: Ship;                                 // the ship with all data from the server
    stones: Stone[] = [];                       // the stones of this ship
    places = [];                                // just needed to generate stone places on the middle on the ship
    littleStones = [];                          // just needed to generate little stones in the front of the ship
    hasSupplySledStones: boolean;               // boolean to check if the supplySled of this player has stones to place on the ship
    hasShipUpdated: boolean[] = [];             // boolean to check if the ship has updated since the last polling and show changes to the user
    localIdSave: number = 0;                    // component ship id variable

    // drag n drop functionalities and variables
    transferData: String = "";
    transferData_LEVER: String = "";
    isDragged: boolean = false;
    isDropped: boolean = false;

    // for @CHISEL/@SAIL market card move to save the first of two placed stones (static so other ships can access this stone too)
    static firstShipId: number = 0;
    static firstPlaceOnShip: number = 0;

    // @LEVER
    static isShipSelected: boolean = false;
    isDetailShipSelected:boolean = false;
    selectedShip: Ship =  new Ship();
    sortableLeverStones:Stone[] = [];
    isStoneOrderConfirmed:boolean = false;

    constructor(private shipService: ShipService,
                private moveService: MoveService,
                private playerService: PlayerService) {
    }

    // initialize component
    ngOnInit() {
        // get player number from local storage
        let player = JSON.parse(localStorage.getItem('player'));
        this.playerNumber = player.number;
        this.playerColor = player.color;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get all ship data from the service and initially create the ship
        this.updateShip(true);
        // initialize and start polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateShip(false);
            that.updateSupplySled();
        }, this.timeoutInterval);
    }

    // is called before ngOnInit if changes have been made to the @Input values
    ngOnChanges() {
        if (this.ID != this.localIdSave) {
            this.updateShip(true);

            ShipComponent.isShipSelected = false;
            this.isDetailShipSelected = false;
            this.selectedShip = null;
            this.isStoneOrderConfirmed = false;

            // save id locally
            this.localIdSave = this.ID;
        }
    }


    // TODO: ensure component will be destroyed when changing to the winning screen
    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // get ship with ID
    updateShip(init: boolean): void {
        if (this.ROUND != 0) {
            this.shipService.getShip(this.gameId, this.ROUND, this.ID).subscribe(
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

                    // @CHISEL
                    // @SAIL
                    // check if first of the two stones was placed
                    if (ShipComponent.firstShipId != 0 && ShipComponent.firstPlaceOnShip != 0) {
                        // add stone to this stones if the stone was set on THIS ship
                        if (this.ID == ShipComponent.firstShipId) {
                            let stone: Stone = new Stone();
                            stone.id = ShipComponent.firstShipId;
                            stone.color = this.playerColor;
                            stone.placeOnShip = ShipComponent.firstPlaceOnShip;
                            stones[ShipComponent.firstPlaceOnShip - 1] = stone;
                            this.hasShipUpdated[ShipComponent.firstPlaceOnShip - 1] = true;
                        }
                    }

                    // save received stones
                    this.stones = stones;

                    // create divs for stones if ship is initializing
                    if (init) {
                        this.createShip(ship);
                    }
                });
        }
    }

    // get newest supplySled data from server and check whether there are stones to place on the ship
    updateSupplySled(): void {
        this.playerService.getPlayer(this.gameId, this.playerNumber)
            .subscribe(playerData => {
                if (playerData) {
                    // check if there are stones on the sled
                    this.hasSupplySledStones = playerData.supplySled.stones.length > 0;
                } else {
                    console.log("supplySled data error");
                }
            })
    }

    // set stone on a specified place on the ship
    //
    setStone(number: number) {
        console.log("setStone");
        // check if it is this players turn,
        // the ship has not sailed yet and
        // the specified place is not already occupied
        if (!this.IS_SUB_ROUND && this.IS_MY_TURN && !this.ship.hasSailed && !this.isOccupied(number)) {
            // check if a blue market card was played
            if (this.IS_PLAYING_CARD) {
                switch (this.CARD_TYPE) {
                    case 'HAMMER':
                        // information needed for the request
                        // gameId: number, roundNr: number, playerNr: number,
                        // cardId: number, cardType: string,
                        // shipId: number, placeOnShip: number

                        this.moveService.playMarketCard_HAMMER(
                            this.gameId, this.ROUND, this.playerNumber,
                            this.CARD_ID, this.CARD_TYPE,
                            this.ID, ++number,
                        ).subscribe(response => {
                            if (response) {
                                console.log("playing Card: " + this.CARD_TYPE);

                            } else {
                                console.log("supplySled data error");
                            }
                        });

                        break;
                    case 'CHISEL':
                        // only allow if there are stones on the sled
                        if (this.hasSupplySledStones) {
                            // information needed for the request @CHISEL
                            // gameId: number, roundNr: number, playerNr: number,
                            // cardId: number, cardType: string,
                            // shipId: number, placeOnShip: number,
                            // shipId2: number, placeOnShip2: number

                            // check if first of two stone was already placed
                            if (ShipComponent.firstShipId != 0 && ShipComponent.firstPlaceOnShip != 0) {
                                //console.log("2nd stone");
                                // second stone was placed -> make move
                                this.moveService.playMarketCard_CHISEL(
                                    this.gameId, this.ROUND, this.playerNumber,
                                    this.CARD_ID, this.CARD_TYPE,
                                    ShipComponent.firstShipId, ShipComponent.firstPlaceOnShip,
                                    this.ID, ++number,
                                ).subscribe(response => {
                                    if (response) {
                                        console.log("playing Card: " + this.CARD_TYPE);

                                        ShipComponent.firstShipId = 0;
                                        ShipComponent.firstPlaceOnShip = 0;
                                    } else {
                                        console.log("supplySled data error");
                                    }
                                });
                            } else {
                                //console.log("1st stone");
                                // first stone was placed -> place and wait for second stone
                                ShipComponent.firstShipId = this.ID;
                                ShipComponent.firstPlaceOnShip = ++number;
                            }
                        }
                        break;

                    case 'SAIL':
                        // only allow if there are stones on the sled
                        if (this.hasSupplySledStones) {
                            // check if stone was already placed
                            if (ShipComponent.firstShipId != 0 && ShipComponent.firstPlaceOnShip != 0) {
                                // ship sailing is handled at site harbors
                            } else {
                                // stone was placed just now -> place and wait for sailing
                                ShipComponent.firstShipId = this.ID;
                                ShipComponent.firstPlaceOnShip = ++number;

                                this.SHIP_WANTS_TO_SAIL.emit(true);
                            }
                        }
                        break;
                }

            } else {
                // only allow if there are stones on the sled
                if (this.hasSupplySledStones) {
                    // if no blue market card was played, make normal place stone move
                    this.moveService.placeStone(this.gameId, this.ROUND, this.playerNumber, this.ID, ++number)
                        .subscribe(response => {
                            //TODO: catch error of request response
                            console.log(response);
                        });
                }
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
    createShip(ship: Ship) {
        // create temporary array to hold the ship data
        let places = [];
        let littleStones = [];
        let hasShipUpdated = [];

        // initialize place divs on ship
        for (let i = 0; i < ship.MAX_STONES; i++) {
            let place = {id: i};
            places.push(place);
        }

        // initialize little stones in front of the ship
        for (let i = 0; i < ship.MIN_STONES; i++) {
            let littleStone = {id: i.toString()};
            littleStones.push(littleStone);
        }

        // initialize change variable to ship size
        for (let i = 0; i < ship.MAX_STONES; i++) {
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


    // @HAMMER_MOVE
    is_HAMMER_MOVE(): boolean {
        return this.IS_PLAYING_CARD && this.CARD_TYPE == 'HAMMER';
    }

    // @HAMMER_MOVE
    is_CHISEL_MOVE(): boolean {
        return this.IS_PLAYING_CARD && this.CARD_TYPE == 'CHISEL';
    }

    // @SAIL_MOVE
    isSAIL_MOVE(): boolean {
        return this.IS_PLAYING_CARD && this.CARD_TYPE == 'SAIL';
    }

    // @SAIL_MOVE
    isReadyForSAIL_MOVE(): boolean {
        // check if ship is ready to sail after one more stone is placed on it, this is if:
        return (this.ship.stones.length >= this.ship.MIN_STONES - 1) &&     // number of min stones is reached now or after placing on stone
            (this.ship.stones.length + 1 <= this.ship.MAX_STONES);          // ship is able to take one more stone
    }

    // @LEVER_MOVE
    is_LEVER_MOVE(): boolean {
        return this.IS_PLAYING_CARD && this.CARD_TYPE == 'LEVER';
    }

    SAIL_card_move_stone_placed(): boolean {
        return ShipComponent.firstShipId != 0;
    }

    SAIL_card_move_stone_placed_on_this_ship(): boolean {
        return ShipComponent.firstShipId != 0 && ShipComponent.firstShipId == this.ID;
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR LEVER MOVE
    // *************************************************************

    selectShip(selectedShip:Ship):void{
        this.isDetailShipSelected = true;
        // temporary array for the to be sorted stones
        let sortableArray = [];

        // initialize array
        for (var i = 0; i < this.places.length; i++) {
            sortableArray.push(undefined);
        }
        // place stones in array at correct location
        for (var i = 0; i < selectedShip.stones.length; i++) {
            sortableArray[selectedShip.stones[i].placeOnShip - 1] = selectedShip.stones[i];
        }
        // assign to sortableLeverStones in reversed Order
        this.sortableLeverStones = sortableArray.slice().reverse();

        $('#ship' + selectedShip.id).css("opacity", "0.5");
        // toggle for detail view of ship to be sorted
        ShipComponent.isShipSelected = !ShipComponent.isShipSelected;
        if(selectedShip != this.selectedShip){
            this.selectedShip = null;
            this.selectedShip = selectedShip;
            ShipComponent.isShipSelected = true;
        }
    }

    // once the stones are sorted, they must be confirmed
    confirmStoneOrder(): void {
        this.isStoneOrderConfirmed = true;

        // number array to hold the order of the stones
        let orderedStoneIds: number[] = [];

        for (var i = 0; i < this.sortableLeverStones.length; i++) {
            if (this.sortableLeverStones[i] != undefined) {
                orderedStoneIds.push(this.sortableLeverStones[i].id);
            }
        }

        // data to transfer to the site-harbor for the LEVER MOVE if the ship is sailed to a site
        this.transferData_LEVER = JSON.stringify({
            gameId: this.gameId,
            roundNr: this.ROUND,
            playerNr: this.playerNumber,
            moveType: this.CARD_TYPE,
            cardId: this.CARD_ID,
            shipId: this.ID,
            unloadingOrder: orderedStoneIds.slice().reverse()
        });
    }

    // check if the stone order was confirmed, if yes then no more dragging is possible
    isDragEnabled(): boolean {
        return !this.isStoneOrderConfirmed;
    }

    isShipSelected():boolean{
        return ShipComponent.isShipSelected;
    }

    // removes selectedShip and closes div
    closeLeverDetailShip(): void {
        this.isStoneOrderConfirmed = false;
        $('#ship'+this.selectedShip.id).show().css("opacity","1");
        ShipComponent.isShipSelected = false;
        this.isDetailShipSelected = false;
        this.selectedShip = null;
    }

    onShipDrag_LEVER():void{
        if(this.isStoneOrderConfirmed){
            this.SHIP_WANTS_TO_SAIL.emit(true);
        }else{
            return;
        }
    }

    onDragExit_LEVER():void{
        this.SHIP_WANTS_TO_SAIL.emit(false);
    }
    // *************************************************************

}
