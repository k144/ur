let Pawns = [[], []];
let Dices = [];

let TilesToMove = 0;

const NPawns = 7;

const Color = { BLACK: 1, WHITE: 2 };
const Side = { US: 0, THEM: 1 };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}