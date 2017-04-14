/**
 * Created by nikza on 31.03.2017.
 */
import {Stone} from './stone';

export class BuildingSite{
    id:number;
    gameId:number;
    siteType:string;
    docked: boolean;
    stones: Stone[];
}
