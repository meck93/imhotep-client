import {Component, OnInit, Input, OnDestroy} from '@angular/core';

// polling
import {componentPollingIntervall} from '../../../settings/settings';
import Timer = NodeJS.Timer;

// services
import {BurialChamberService} from "../../shared/services/burial-chamber/burial-chamber.service";

// models
import {BuildingSite} from '../../shared/models/buildingSite';
import {Stone} from '../../shared/models/stone';

@Component({
    selector: 'burial-chamber',
    templateUrl: './burial-chamber.component.html',
    styleUrls: ['./burial-chamber.component.css'],
    providers: [BurialChamberService]
})
export class BurialChamberComponent implements OnInit, OnDestroy {
    // polling
    private timeoutId: Timer;
    private timeoutInterval: number = componentPollingIntervall;

    // inputs
    @Input() SHIP_WANTS_TO_SAIL: boolean = false;
    @Input() ROUND: number = 0;
    @Input() IS_PLAYING_CARD: boolean = false;
    @Input() CARD_ID: number = 0;
    @Input() CARD_TYPE: string = '';

    // local storage data
    gameId: number;

    // component fields
    burialChamberId: number;                // site ID
    rows: Stone[][] = [];                   // the rows for the stones on this building site
    nrOfRows: number;                       // in how many rows the stones are split into
    hasShipDocked: boolean = false;         // boolean to determine if a ship is docked at the site
    totalBurialChamberStones: number = 0;   // total number of stones on the site
    changedStones: boolean[] = [];          // array that holds changed stones
    showPopUp: boolean = false;             // flag if popup need to be shown
    errorMessage: string;                   // holds error message

    static alreadyInit: boolean = false;

    constructor(private burialChamberService: BurialChamberService) {

    }

    // *************************************************************
    // MAIN FUNCTIONS
    // *************************************************************

    // initialize component
    ngOnInit() {
        // ensure that component only initializes once
        if (BurialChamberComponent.alreadyInit) {
            return;
        }
        BurialChamberComponent.alreadyInit = true;

        // get game id from local storage
        let game = JSON.parse(localStorage.getItem('game'));
        this.gameId = game.id;

        // get the stones from the server
        this.updateBurialChamber();

        // polling
        let that = this;
        this.timeoutId = setInterval(function () {
            that.updateBurialChamber();
        }, this.timeoutInterval)
    }

    // destroy component
    ngOnDestroy(): void {
        // kill the polling
        clearInterval(this.timeoutId);
    }

    // updates the stones-array via a GET request to the server
    updateBurialChamber(): void {
        // console.log("updating burial chamber");
        this.burialChamberService.updateBurialChamberStones(this.gameId)
            .subscribe(BuildingSite => {
                if (BuildingSite) {
                    // updates the stones array in this component
                    let burialChamber = BuildingSite;
                    // update total amount of stones
                    this.totalBurialChamberStones = BuildingSite.stones.length;
                    // get the ID to pass along to the site-harbor
                    this.burialChamberId = BuildingSite.id;
                    // update the stones of the burial chamber
                    this.updateData(burialChamber);
                }
            }, error => this.errorMessage = <any>error);
    }

    // *************************************************************
    // HELPER FUNCTIONS
    // *************************************************************

    // updates the changed stones to highlight changes
    updateData(burialChamber: BuildingSite): void {
        // get stones of the pyramid
        let stones = burialChamber.stones;

        // copy stones to later check if something has changed since the last polling
        let stones2 = JSON.parse(JSON.stringify(stones));

        // make changes of the pyramid visible
        for (let i = 0; i < stones2.length; i++) {
            // if there was no stone before, something change since the last polling
            if (this.changedStones[i] == undefined) {
                this.changedStones.push(true);
            } else {
                this.changedStones[i] = false;
            }
        }
        // update harbor
        this.hasShipDocked = burialChamber.docked;
        // arrange the stones
        this.arrangeStones(stones);
    }

    // places the current stones in rows for the component to display in the html
    arrangeStones(stones: Stone[]): void {
        // temporary stone array
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);

        for (let i = 0; i < this.nrOfRows; i++) {
            // splits the array into pieces of 3
            let oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
        }
        // assign the stones
        this.rows = tempArray;

    }

    // *************************************************************
    // HELPER FUNCTIONS UI
    // *************************************************************

    // check whether the next stone is placed in this row or not
    isNextStoneInThisRow(startIndex: number, endIndex: number) {
        return this.totalBurialChamberStones >= startIndex && this.totalBurialChamberStones < endIndex;
    }
}
