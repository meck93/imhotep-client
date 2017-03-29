import {Stone} from './stone';

export class Obelisk {

    private id: number;
    POINTS_FOR_TWO: number[];
    POINTS_FOR_THREE: number[];
    POINTS_FOR_FOUR: number[];
    hasShip: boolean;

    stoneCount: number;
    PLACES=[];


    constructor(id: number) {
        this.id = id;
        this.stoneCount = 0;
        this.hasShip = false;
    }









public getId(): number {
        return this.id;
    }




}