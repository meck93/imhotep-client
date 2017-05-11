import {Stone} from './stone';

export class BuildingSite{
    id:number;
    gameId:number;
    siteType:string;
    docked: boolean;
    stones: Stone[];
}
