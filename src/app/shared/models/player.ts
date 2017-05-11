import {SupplySled} from "./supplySled";
import {MarketCard} from "./market-card";

export class Player {
    public id: number;
    public username: string;
    public points: number[];
    public color: string;
    public playerNumber: number;
    public supplySled: SupplySled;
    public handCards: MarketCard[];
    public moves: string[];
    public gameId: number;
}
