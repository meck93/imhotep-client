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
    @Input() HAS_DOCKED_SHIP;
    @Input() ORIENTATION: string; // either 'vertical' or 'horizontal'
    @Input() SITE_ID:number;

    hasDockedShip: boolean = false;
    hasUpdated: boolean = false;
    isDragOver:boolean = false;

    dockedShip: Ship;
    receivedObject:any;

    constructor(private moveService: MoveService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hasUpdated = this.hasDockedShip != this.HAS_DOCKED_SHIP;
    }

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
        this.receivedObject = JSON.parse(event.dragData);
        var x = this.receivedObject.shipId;
        $('#ship'+x).hide();
        this.isDragOver = false;
        this.sailShipToSite();
    }

    allowDrop():boolean{
        return this.hasDockedShip;
    }

    onDragOver(){
        this.isDragOver = true;
    }

    onDragExit(){
        console.log("exit");
        this.isDragOver = false;
    }

}
