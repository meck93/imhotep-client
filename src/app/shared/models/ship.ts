import {Stone} from './stone';
import {isNumber} from "util";

export class Ship {
    private id: number;
    private MIN_STONES: number;
    private MAX_STONES: number;
    private stones: Stone[];


    constructor(id: number, MIN_STONES: number, MAX_STONES: number, stones: Stone[]) {
        this.id = id;
        this.MIN_STONES = MIN_STONES;
        this.MAX_STONES = MAX_STONES;
        this.stones = stones;
    }

    public getId(): number {
        return this.id;
    }

    public getMinStones(): number {
        return this.MIN_STONES;
    }

    public getMaxStones(): number {
        return this.MAX_STONES;
    }

    public getStones(): Stone[] {
        return this.stones;
    }

    public placeStone(color:string, place:number) {
        this.stones[place].color = color;
    }

    public isOccupied(place:number) {
        return this.stones[place].color!='';
    }

    public isReadyToSail() {
        let numberOfStones = 0;
        for (let i=0; i<this.MAX_STONES; i++) {
            if (this.isOccupied(i)) {
                numberOfStones++;
            }
        }

        return numberOfStones >= this.MIN_STONES;
    }
}
