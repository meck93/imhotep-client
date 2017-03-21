/**
 * Created by nikza on 21.03.2017.
 */
import { Injectable } from '@angular/core';

import { Game } from '../models/game';
import { GAMES } from '../models/mock-games';

@Injectable()
export class GameService {
    getGames(): Promise<Game[]> {
        return Promise.resolve(GAMES);
    }
}