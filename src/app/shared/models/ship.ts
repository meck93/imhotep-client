import {Stone} from './stone';

export class Ship {
    public id: number;
    public minStone: number;
    public maxStone: number;
    public gameId: number;
    public stones: Stone[];
}
