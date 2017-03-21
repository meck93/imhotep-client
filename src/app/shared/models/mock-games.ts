/**
 * Created by nikza on 21.03.2017.
 */
import { Game } from "./game";

export const GAMES: Game[] = [
    { id: 1, status: 'running', playerCount: 2, owner: 'PlayerA' },
    { id: 2, status: 'full', playerCount: 4, owner: 'PlayerB' },
    { id: 3, status: 'waiting for players', playerCount: 2, owner: 'PlayerC' },
    { id: 4, status: 'waiting for players', playerCount: 1, owner: 'xyz' },
];