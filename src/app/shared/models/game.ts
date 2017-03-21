/**
 * Created by nikza on 21.03.2017.
 */
export class Game {
    id: number;
    playerCount: number;
    status: string;
    // owner is set as string because user does not have id the moment. later work with number
    owner: string;
}