import {Stone} from './stone';

export class Ship {
    private id: number;
    private MIN_STONES: number;
    private MAX_STONES: number;
    //public stones:Stone[];


    constructor(id: number, MIN_STONES: number, MAX_STONES: number) {
        this.id = id;
        this.setMinStones(MIN_STONES);
        this.setMaxStones(MAX_STONES);
        //this.stones = stones;
    }

    public getId(): number {
        return this.id;
    }

    public getMinStones(): number {
        return this.MIN_STONES;
    }

    public setMinStones(minStones: number): void {
        this.MIN_STONES = minStones;
    }

    public getMaxStones(): number {
        return this.MAX_STONES;
    }

    public setMaxStones(maxStones: number): void {
        this.MAX_STONES = maxStones;
    }
}
