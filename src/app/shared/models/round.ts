import {Ship} from "./ship";

export class Round {
    public id:number;
    public roundNumber:number;
    public card:string;
    public moves:string[];
    public ships:Ship[];
}