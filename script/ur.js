const BoardDiv = document.getElementById("board");

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

const Color = { BLACK: 1, WHITE: 2 };
const Side = { US: 0, THEM: 1 };

const MaxPos = 15;
const NPawns = 7;

let TilesToMove = 3;

function locateTile(pawn, offset = 0) {
    let side = pawn.side;
    let pos = pawn.pos + offset;

    let row, col;

    if (side == Side.US) {
        col = 1;
    } else if (side == Side.THEM) {
        col = 3;
    }

    if (pos <= 4) {
        row = 5 - pos;
    } else if (pos <= 12) {
        row = pos - 4;
        col = 2;
    } else {
        row = 13 - pos + 8;
    }
    return tiles[col - 1][row - 1];

}


Object.defineProperty(HTMLElement.prototype, 'getPawn', {
    value: function () { return Pawns[this.dataset.side][this.dataset.nth]; }
})


class Pawn {
    constructor(color, side, nth) {
        this.color = color;
        this.side = side;
        this.pos = 0;
        this.div = document.createElement("div");
        this.div.dataset.nth = nth;
        this.div.dataset.side = side;
        this.div.addEventListener("click", () => {
            this.clearSel(TilesToMove);
            if ((this.pos + TilesToMove) > MaxPos) {
                return;
            }
            let otherPawnsDiv = locateTile(this, TilesToMove).firstChild;
            if (otherPawnsDiv != null) {
                var otherPawn = otherPawnsDiv.getPawn();
                if (otherPawn.side == this.side &&
                    (this.pos + TilesToMove) < MaxPos
                ) {
                    return;
                } else if (otherPawn.side != this.side) {
                    otherPawn.moveBack();
                }
            }
            this.move(TilesToMove);
        }
        );
        this.div.addEventListener("mouseover", () => {
            this.showLegalMoves(TilesToMove);
        }
        );
        this.div.addEventListener("mouseleave", () => {
            this.clearSel(TilesToMove);
        }
        );

    }
    move(n) {
        this.pos += n;
        this.draw();
        //sprawdz czy miejsce jest wolne
    }
    moveBack() {
        this.move(-(this.pos));
        console.log("Zbite");
    }
    canMove(offset) {
        let tile = locateTile(this, offset);
        let child = tile.firstChild;
        if (child == undefined) {
            return true;
        }
        return true;
    }
    draw() {
        this.div.classList.add("pawn");
        if (this.color == Color.BLACK) {
            this.div.classList.add("pawn-black");
        }
        if (this.color == Color.WHITE) {
            this.div.classList.add("pawn-white");
        }

        let tile = locateTile(this);
        tile.appendChild(this.div);
    }
    showLegalMoves(offset) {
        if (!this.canMove(TilesToMove)) {
            return;
        }
        locateTile(this, offset).classList.add("tile-selected");
    }
    clearSel(offset) {
        locateTile(this, offset).classList.remove("tile-selected");
    }
}



let tiles = new Array(Board.length);
for (let i = 0; i < tiles.length; i++) {
    tiles[i] = new Array(3)
}

function putTile(x, y, type) {
    let tile = document.createElement("div");

    tile.className = "tile";
    if (type != undefined) {
        tile.className += ` tile-${type}`;
    }

    tile.style.gridColumn = x + "/ span 1";
    tile.style.gridRow = y + "/ span 1";

    BoardDiv.append(tile);
    tiles[x - 1][y - 1] = tile;
}

function drawBoard() {
    Board.forEach((row, i) => {
        [...row].forEach((tile, j) => {
            let type = TileTypeMap.get(tile);
            putTile(j + 1, i + 1, type);
        })
    })


}

function drawPawns() {
    for (let i = 0; i < Pawns.length; i++) {
        for (let j = 0; j < Pawns[i].length; j++) {
            Pawns[i][j].draw();
        }
    }
}

class Dice {
    //kostki, losowanie
    constructor() {
        this.orientation = 0;
        this.drawn = false;
        this.div = document.createElement("div");
        this.div.className = "dice";
        document.getElementById("dices").appendChild(this.div);
        this.updateImage();
    }
    draw() {
        this.orientation = Math.floor(Math.random() * (5 + 1));
        this.drawn = this.orientation < 3;
        this.updateImage();
    }
    updateImage() {
        let style = `url('./resources/dice_${+this.drawn}_${this.orientation % 3}.png')`;
        this.div.style.backgroundImage = style;
    }

}

function roll() {
    TilesToMove = 0;
    for (let dice of dices) {
        dice.draw();
        TilesToMove += dice.drawn;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let Pawns = [[], []];
async function init() {
    drawBoard();
    for (let i = 0; i < NPawns; i++) {
        Pawns[0].push(new Pawn(Color.WHITE, Side.US, i));
        Pawns[1].push(new Pawn(Color.BLACK, Side.THEM, i));
    }

    drawPawns();
}


let dices = [];
for (let i = 0; i < 4; i++) {
    dices.push(new Dice());
}

roll()

let dicesDiv = document.getElementById('dices')
dicesDiv.addEventListener("click", () => roll());


init();