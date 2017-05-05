/**
 * Created by nikza on 01.05.2017.
 */

export class PageElement {
    public id:number;
    public gameId:number;
    public roundId:number;
    public playerNr: number;
    public userName: string;

    public moveType: string;

    public cardId: number;

    public shipId: number;
    public shipId2: number;
    public placeOnShip: number;
    public placeOnShip2: number;
    public hasSailed: boolean;

    public unloadingOrder: number[];

    public targetSiteId: number;
    public targetSiteType: string;

    public marketCardType: string;

    public moveMessage: string;

}