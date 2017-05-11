import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import Timer = NodeJS.Timer;

// models
import {Hint} from '../shared/models/hint';

// data
import {HINTS} from '../shared/data/hints'

@Component({
    selector: 'hints',
    templateUrl: './hints.component.html',
    styleUrls: ['./hints.component.css']
})
export class HintsComponent implements OnInit, OnDestroy {
    @Input() INTERVAL: number = 0;

    timeoutId: Timer;           // id of timer
    hint: Hint = new Hint();    // currently displayed hint

    constructor() {
    }

    // *************************************************************
    // MAIN FUNCTIONS
    // *************************************************************

    ngOnInit() {
        // get first hint
        this.hint = this.getNextHint(-1);

        let that = this;
        this.timeoutId = setInterval(function () {
            // get next hint
            that.hint = that.getNextHint(that.hint.id);
        }, this.INTERVAL);
    }

    ngOnDestroy() {
        clearInterval(this.timeoutId);
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // returns the next hint of the HINTS list
    getNextHint(lastHintNumber: number): Hint {
        return {
            id: ++lastHintNumber,
            value: HINTS[lastHintNumber % HINTS.length]
        };
    }
}
