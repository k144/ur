let Pawns = [[], []];
let Dices = [];

let TilesToMove = 0;

let Config = {}

const Color = { BLACK: 1, WHITE: 2 };
const Side = { LEFT: 0, RIGHT: 1 };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}