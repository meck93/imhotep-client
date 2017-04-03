import {Component, OnInit} from '@angular/core';
import {Stone} from '../../shared/models/stone';
import {MOCKSTONES} from '../../shared/models/mock-stones';
import {Game} from '../../shared/models/game';
import {BuildingSite} from '../../shared/models/buildingSite';
//import {PyramidService} from "../../shared/services/burial-chamber/pyramid.service"; /*TODO HAS TO BE CREATED
import Timer = NodeJS.Timer;

@Component({
    selector: 'pyramid',
    templateUrl: './pyramid.component.html',
    styleUrls: ['./pyramid.component.css']
})
export class PyramidComponent implements OnInit {

    game: Game; // current game
    pyramid: BuildingSite;
    stones: Stone[] = MOCKSTONES; // temporary, replaced by service
    firstPyramid: Stone[][] = [];
    secondPyramid: Stone[][] = [];
    thirdPyramid: Stone[][] = [];
    additionalStones: Stone[] = [];
    nrOfRows: number;
    stoneCounter: number = 0;


    constructor() {
    }

    ngOnInit() {
        if (this.stones.length <= 9) {
            var temp1 = this.stones.splice(0, 9);
            this.arrangeFirstPyramid(temp1);
        }

        if (this.stones.length > 9) {
            var temp2 = this.stones.splice(9, 11);
            this.arrangeSecondPyramid(temp2);
        }

        if (this.stones != undefined) {
            var temp = this.stones.splice(14, this.stones.length);
            this.arrangeThirdPyramid(temp);
        }
    }

    arrangeFirstPyramid(stones: Stone[]): void {
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);
        console.log(this.nrOfRows);
        //console.log("arrangeStoneBeginning");

        for (var i = 0; i < this.nrOfRows; i++) {
            //splits the array into pieces of 3
            var oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
            //console.log(oneRowArray);
        }

        this.firstPyramid = tempArray;
    }

    arrangeSecondPyramid(stones: Stone[]): void {
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);
        console.log(this.nrOfRows);
        //console.log("arrangeStoneBeginning");

        for (var i = 0; i < this.nrOfRows; i++) {
            //splits the array into pieces of 3
            var oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
            //console.log(oneRowArray);
        }

        this.secondPyramid = tempArray;
    }

    arrangeThirdPyramid(stones: Stone[]): void {
        let tempArray: Stone[][] = [];
        this.nrOfRows = (stones.length / 3);
        console.log(this.nrOfRows);
        //console.log("arrangeStoneBeginning");

        for (var i = 0; i < this.nrOfRows; i++) {
            //splits the array into pieces of 3
            var oneRowArray = stones.splice(0, 3);
            tempArray.push(oneRowArray);
            //console.log(oneRowArray);
        }

        this.thirdPyramid = tempArray;
    }

}
