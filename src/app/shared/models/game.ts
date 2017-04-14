import {Player} from "./player";
import {Round} from './round';
import {BuildingSite} from "./buildingSite";

export class Game {
    public id: number;
    public name: string;
    public owner: string;
    public status: string;
    public currentPlayer: number;
    //public currentSubroundPlayer: number;
    public roundCounter: number;
    public obelisk:BuildingSite;
    public burialChamber:BuildingSite;
    public pyramid: BuildingSite;
    public temple: BuildingSite;
    public numberOfPlayers: number;
    public marketPlace: string[];
    public stoneQuarry: string[];
    public rounds: Round[];
    public players: Player[];
}