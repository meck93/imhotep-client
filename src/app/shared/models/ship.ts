import {Stone} from './stone';

export class Ship {
    public id: number;
    public gameId: number;
    public hasSailed: boolean;
    public targetSite: string;
    public stones: Stone[];
    public max_STONES: number;
    public min_STONE: number;
}