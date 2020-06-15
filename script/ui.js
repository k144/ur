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
