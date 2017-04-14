import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";
import {MoveService} from "../../shared/services/move/move.service";

// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');
declare let jQuery: any;

@Component({
    selector: 'site-harbor',
    templateUrl: './site-harbor.component.html',
    styleUrls: ['./site-harbor.component.css'],
    providers: [MoveService]
})
export class SiteHarborComponent implements OnInit {
    // inputs
    @Input() HAS_DOCKED_SHIP;     // information if ship has docked on parent-site
    @Input() ORIENTATION: string; // either 'vertical' or 'horizontal'
    @Input() SITE_ID:number;      // ID of parent site
    @Input() SHIP_WANTS_TO_SAIL:boolean = false;

    hasDockedShip: boolean = false;
    hasUpdated: boolean = false;
    isDragOver:boolean = false;

    receivedObject:any;

    constructor(private moveService: MoveService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hasUpdated = this.hasDockedShip != this.HAS_DOCKED_SHIP;
        this.hasDockedShip = this.HAS_DOCKED_SHIP;
    }

    // SAIL SHIP MOVE
    // is triggered when a ship is dropped inside the droppable-zone
    sailShipToSite():void {
        this.moveService.sailShipToSite(this.receivedObject.gameId,
                                        this.receivedObject.roundNr,
                                        this.receivedObject.playerNr,
                                        this.receivedObject.shipId,
                                        this.SITE_ID)
            .subscribe(response => {
                //TODO: catch error
                console.log(response);
            });
    }

    transferDataSuccess(event) {
        this.HAS_DOCKED_SHIP = true;
        this.hasDockedShip = true;
        // parse received data into object
        this.receivedObject = JSON.parse(event.dragData);
        var x = this.receivedObject.shipId;
        // hide sailed ship if it was dropped successfully
        $('#ship'+x).hide();
        this.isDragOver = false;
        // make the sail move
        this.sailShipToSite();
    }

    allowDrop():boolean{
        if(this.HAS_DOCKED_SHIP === true){
            return true;
        }else{
            return false;
        }
    }

    onDragOver(){
        this.isDragOver = true;
    }

    onDragExit(){
        console.log("exit");
        this.isDragOver = false;
    }

}
