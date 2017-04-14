import {Component, OnInit, Input} from '@angular/core';
import {Ship} from "../../shared/models/ship";

// others
let $ = require('../../../../node_modules/jquery/dist/jquery.slim.js');
declare let jQuery: any;

@Component({
    selector: 'site-harbor',
    templateUrl: './site-harbor.component.html',
    styleUrls: ['./site-harbor.component.css']
})
export class SiteHarborComponent implements OnInit {
    // inputs
    @Input() HAS_DOCKED_SHIP: boolean = false;
    @Input() ORIENTATION: string; // either 'vertical' or 'horizontal'

    hasDockedShip: boolean = false;
    hasUpdated: boolean = false;
    isDragOver:boolean = false;

    dockedShip: Ship;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hasUpdated = this.hasDockedShip != this.HAS_DOCKED_SHIP;
    }

    transferDataSuccess(event) {
        this.HAS_DOCKED_SHIP = true;
        this.hasDockedShip = true;
        console.log(event);
        this.dockedShip = JSON.parse(event.dragData);
        console.log(this.dockedShip);
        console.log(this.dockedShip.id);
        var x = this.dockedShip.id.toString();
        console.log(x);
        $('#ship'+x).hide();

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
