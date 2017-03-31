import {Player} from "./player";
import {Round} from './round';
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
    public obelisk:string[];
    public burialChamber:string[];
    public pyramid: string[];
    public temple: string[];
    public amountOfPlayers: number;
    public marketPlace: string[];
    public stoneQuarry: string[];
    public rounds: Round[];
    public players: Player[];

}