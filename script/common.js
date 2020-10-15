let Pawns = [[], []];
let Dices = [];

let TilesToMove = 0;

const NPawns = Config.nPawns.val;
// Config = {} zdeklarowany w pliku config.js

const Color = { BLACK: 1, WHITE: 2 };
const Side = { LEFT: 0, RIGHT: 1 };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function callIfExists(func) {
    if (typeof func === "function") {
        func();
    }
}

let isTouchDevice = (() => {
    let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    let mq = function (query) {
        return window.matchMedia(query).matches;
    }
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
})();

let GameHasStarted = false;
