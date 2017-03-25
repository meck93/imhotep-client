import {Stone} from './stone';

export class Ship {
    private MIN_STONES:number;
    private MAX_STONES:number;
    private stones:Stone[];

    public getMinStones():number {
        return this.MIN_STONES;
    }

    public setMinStones(minStones:number):void {
        this.MIN_STONES = minStones;
    }

    public getMaxStones():number {
        return this.MAX_STONES;
    }

    public setMaxStones(maxStones:number):void {
        this.MAX_STONES = maxStones;
    }
}
