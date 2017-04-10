import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'harbor',
    templateUrl: './harbor.component.html',
    styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
    // inputs
    @Input() CURRENTPLAYER: number;
    @Input() ROUND: number;         // the current round
    @Input() IDS: number[];         // the ships id's of the current round

    constructor() {
    }

    ngOnInit() {

    }
}
