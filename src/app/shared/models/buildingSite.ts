/**
 * Created by nikza on 31.03.2017.
 */
import {Stone} from './stone';

export class BuildingSite{
    id:number;
    gameId:number;
    buildingSiteType:String;
    dockedShip: boolean;
    stones: Stone[];
}
