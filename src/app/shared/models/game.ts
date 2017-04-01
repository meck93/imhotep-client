import {Player} from "./player";
import {BuildingSite} from "./buildingSite";
/**
 * Created by nikza on 21.03.2017.
 */
export class Game {
    public id: number;
    public name: string;
    public owner: string;
    public status: string;
    public currentPlayer: number;
    public roundCounter: number;
    public obelisk:BuildingSite;
    public burialChamber:BuildingSite;
    public pyramid: BuildingSite;
    public temple: BuildingSite;
    public amountOfPlayers: number;
    public marketPlace: string[];
    public stoneQuarry: string[];
    public rounds: string[];
    public players: Player[];

}