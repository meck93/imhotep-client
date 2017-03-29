import {Player} from "./player";
/**
 * Created by nikza on 21.03.2017.
 */
export class Game {
    public id: number;
    public name: string;
    public owner: string;
    public status: string;
    public currentPlayer: number;
    public players: Player[];
    public roundCounter: number;
    public amountOfPlayers: number;
}