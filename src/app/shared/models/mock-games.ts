/**
 * Created by nikza on 21.03.2017.
 */
import { Game } from "./game";


export const GAMES: Game[] = [
    { id: 1, status: 'running', playerCount: 2 },
    { id: 2, status: 'full', playerCount: 4 },
    { id: 3, status: 'waiting for players', playerCount: 2 },
    { id: 4, status: 'waiting for players', playerCount: 1 },
];