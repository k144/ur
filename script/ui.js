const BoardDiv = document.getElementById("board");
const DicesDiv = document.getElementById('dices')

const TileTypeMap = new Map([
    ['*', "rosette"],
    ['H', "gate"],
    ['O', "temple"],
    ['.', "house"],
    ['+', "market"],
    ['X', "treasury"],
    [' ', "empty"],
]);

const Board = [
    '*H*',
    'O.O',
    '.+.',
    'O*O',
    ' . ',
    ' + ',
    '*O*',
    'X.X',
];

let tiles = new Array(Board.length);
for (let i = 0; i < tiles.length; i++) {
    tiles[i] = new Array(3)
}

function putTile(x, y, type) {
    let tile = document.createElement("div");

    tile.className = "tile";
    if (type != undefined) {
        tile.classList.add(`tile-${type}`);
    }

    if (type == "rosette") {
        tile.dataset.extraRoll = true;
    } else {
        tile.dataset.extraRoll = false;
    }

    tile.style.gridColumn = x + "/ span 1";
    tile.style.gridRow = y + "/ span 1";

    BoardDiv.append(tile);
    tiles[x - 1][y - 1] = tile;
}

function drawBoard() {
    Board.forEach(async (row, i) => {
        [...row].forEach(async (tile, j) => {
            let type = TileTypeMap.get(tile);
            putTile(j + 1, i + 1, type);
        })
    })
}

function drawPawns() {
    for (let i = 0; i < NPawns; i++) {
        Pawns[0].push(new Pawn(Color.WHITE, Side.LEFT, i));
        Pawns[0][i].draw();
        Pawns[1].push(new Pawn(Color.BLACK, Side.RIGHT, i));
        Pawns[1][i].draw();
    }
}

function stylePawnStack() {
    let style = document.createElement('style');
    style.type = 'text/css';
    let distance = 4;
    for (let i = 1; i < NPawns; i++) {
        style.innerHTML +=
        `
        .tile .pawn:nth-child(${i+1}) {
            position: absolute;
            bottom: ${distance * i}px;
        }
        `;
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

function drawDices() {
    for (let i = 0; i < 4; i++) {
        Dices.push(new Dice());
    }

}

async function displayPrompt(message) {
    const transition = 200;
    const duration = 2*1000;

    let promptElm = document.createElement("div");
    document.getElementById("game").append(promptElm);
    promptElm.className = "prompt";
    promptElm.style.transition = `all ${transition}ms`;
    promptElm.onclick = remove;

    async function remove() {
        promptElm.style.opacity = 0;
        promptElm.style.display = "block";
        await sleep(transition);
        promptElm.parentNode.removeChild(promptElm);
    }


    promptElm.innerHTML = message;
    promptElm.style.display = "block";
    promptElm.style.opacity = 0;
    await sleep(transition);
    promptElm.style.opacity = 1;
    await sleep(duration);
    remove();
    return;
}