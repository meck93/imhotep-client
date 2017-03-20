/**
 * Created by nzaugg on 20.03.2017.
 */
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'winning-screen',
    templateUrl: './winning-screen.component.html',
    styleUrls: ['./winning-screen.component.css']
})
export class WinningScreenComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    clicked() {
        alert("you are on the winning screen");
    }

}
