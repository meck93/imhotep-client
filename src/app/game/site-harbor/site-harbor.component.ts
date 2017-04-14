import {Component, OnInit, Input} from '@angular/core';

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

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hasUpdated = this.hasDockedShip != this.HAS_DOCKED_SHIP;
    }

}
