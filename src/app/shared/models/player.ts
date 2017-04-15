import {Stone} from "./stone";
import {SupplySled} from "./supplySled";
import {MarketCard} from "./market-card";
/**
 * Created by nikza on 24.03.2017.
 */
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
