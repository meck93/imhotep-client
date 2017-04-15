import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    // inputs
    @Input() ROUND: number;         // the current round
    @Input() IDS: number[];         // the ships id's of the current round
    @Input() IS_SUB_ROUND: boolean;
    @Input() IS_MY_TURN: boolean;
    @Input() IS_MY_SUBROUND_TURN: boolean;

    // outputs
    @Output() SHIP_WANTS_TO_SAIL = new EventEmitter();

    constructor() {
    }

    ngOnInit() {

    }

    handleShipDragging(isDragging) {
        this.SHIP_WANTS_TO_SAIL.emit(isDragging);
    }
}

