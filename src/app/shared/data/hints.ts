import {Hint} from '../models/hint';

export const HINTS = [
    "Press F5 to reload the game if something went wrong.",
    "Hover over a question mark on a site to see the rules.",
    "Let's sail to the market place. The cards are helping you gaining more points!",
    "You may leave a game to join another game!",
    "While waiting for other players you can read the manual.",
    "The name on the sled of the current player of the game is pulsing.",
    "Use the 'what happened' button on the right to see the last four moves.",
    "Hover over the market cards on the sleds of your opponents to see their cards."
];

// returns the next hint of the HINTS list
function getNextHint(lastHintNumber: number): Hint {
    return {
        id: ++lastHintNumber,
        value: HINTS[lastHintNumber % HINTS.length]
    };
}
