import {Stone} from "./stone";
/**
 * Created by nikza on 24.03.2017.
 */
export class Player {
    public id: number;
    public username: string;
    public points: number;
    public color: string;
    public playerNumber: number;
    public supplySled: Stone[];
    public handCards: string[];
    public moves: string[];
    public gameId: number;
}

