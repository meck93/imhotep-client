import {MarketCard} from './market-card';

export class MarketPlace {
    id: number;
    gameId: number;
    siteType: string;
    docked: boolean;
    dockedShipId: number;
    marketCards: MarketCard[];
}
