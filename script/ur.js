let boardDiv = document.getElementById("board");

let tileTypeMap = new Map([
    ['*', "rosette"],
    ['H', "gate"],
    ['O', "temple"],
    ['.', "house"],
    ['+', "market"],
    ['X', "treasury"],
    [' ', "empty"],
]);

let board = [
    '*H*',
    'O.O',
    '.+.',
    'O*O',
    ' . ',
    ' + ',
    '*O*',
    'X.X',
];

let tilesToMove = 2;


let Color = {BLACK:1, WHITE:2};
let Side = {US:1, THEM:2};

function locate (pawn, offset = 0) {
    let side = pawn.side;
    let pos = pawn.pos + offset;

    let row, col;

    if (side == Side.US) {
        col = 1;
    } else if (side == Side.THEM) {
        col = 3;
    }

    if (pos <= 4) {
        row = 5-pos;
    } else if (pos <= 12) {
        row = pos-4;
        col = 2;
    } else {
        row = 13-pos + 8;
    }
    return tiles[col-1][row-1];

}

class Pawn {
    constructor(color,side,n){
        this.color=color;
        this.side=side;
        this.pos=0;
        this.div = document.createElement("div");
        this.div.dataset.n = n;
        this.div.addEventListener("click", () => {
            this.clearSel(tilesToMove);
            this.move(tilesToMove);
            tilesToMove = Math.floor((Math.random() * 4) + 1);
        }
        );
        this.div.addEventListener("mouseover", () => {
            this.showLegalMoves(tilesToMove);
        }
        );
        this.div.addEventListener("mouseleave", () => {
            this.clearSel(tilesToMove);
        }
        );
        
    }
    move(n) {
        if(this.canMove(tilesToMove)){
            this.pos+=n;
            this.draw();
        }
    
        //sprawdz czy miejsce jest wolne
    }
    canMove(offset){
        let tile = locate(this, offset);
        let child = tile.firstChild;
        console.log(child,tile);
        if(child==undefined){
            return true;
        }
        return true;
    }
    draw() {
        this.div.classList.add("pawn");
        if(this.color==Color.BLACK){
            this.div.classList.add("pawn-black");
        }
        if(this.color==Color.WHITE){
            this.div.classList.add("pawn-white");
        }

        let tile = locate(this);
        tile.appendChild(this.div);
    }
    showLegalMoves(offset) {
        if(!this.canMove(tilesToMove)){
            return;
        }
        locate(this, offset).classList.add("tile-selected");
    }
    clearSel(offset) {
        locate(this, offset).classList.remove("tile-selected");
    }
}



let tiles = new Array(board.length);
for (let i = 0; i < tiles.length; i++) {
    tiles[i] = new Array(3)
}

function putTile (x, y, type)
{
    let tile = document.createElement("div");

    tile.className = "tile";
    if (type != undefined) {
        tile.className += ` tile-${type}`;
    }

    tile.style.gridColumn = x + "/ span 1";
    tile.style.gridRow = y + "/ span 1";

    boardDiv.append(tile);
    tiles[x-1][y-1] = tile;
}

function drawBoard ()
{
    board.forEach((row, i) => {
        [...row].forEach((tile, j) => {
            let type = tileTypeMap.get(tile);
            putTile(j+1, i+1, type);
        })
    })


}

function drawPawns(stack) {
    for (let i=0; i<stack.length; i++) {
        stack[i].draw();
    }
}

//function dices(){
    //kostki, losowanie
//}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init(){
    drawBoard();
    let usPawns=new Array();
    let themPawns=new Array();

    for(let i=0;i<7;i++){
        usPawns.push(new Pawn(Color.WHITE,Side.US,i));
        themPawns.push(new Pawn(Color.BLACK,Side.THEM,i));
    }

    drawPawns(usPawns);
    drawPawns(themPawns);
    usPawns[1].move(2);
    console.log(usPawns[1]);
}

init();