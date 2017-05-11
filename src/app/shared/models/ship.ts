import {Stone} from './stone';

export class Ship {
    public id: number;
    public gameId: number;
    public hasSailed: boolean;
    public stones: Stone[];
    public MAX_STONES: number;
    public MIN_STONES: number;
}
