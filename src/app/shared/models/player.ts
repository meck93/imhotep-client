import {User} from "./user";
/**
 * Created by nikza on 24.03.2017.
 */
export class Player {
    public id: number;
    public user: User[];
    public moves: string[];
    public points: number;
    public color: string;
    public playerNumber: number;
}