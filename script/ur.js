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



let Color = {BLACK:1, WHITE:2};
let Side = {US:1, THEM:2};

class Pawn {
    constructor(color,side){
        this.color=color;
        this.side=side;
        this.pos=0;
        this.div = document.createElement("div");
    }
    move(n){
        this.pos+=n;
        drawPawn(this);
        //sprawdz czy miejsce jest wolne
        
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

            // iteratory w foreach() zaczynają się od 0, a elementy w gridzie od 1
            // dlatego trzeba dodać 1 //zerzniete z magicznych bloczkow
            putTile(j+1, i+1, type);
        })
    })


}

function drawPawn(pawn) {
    let side = pawn.side;
    let pos = pawn.pos;
    let color = pawn.color;
    let div = pawn.div;


    div.classList.add("pawn");
    if(color==Color.BLACK){
        div.classList.add("pawn-black");
    }
    if(color==Color.WHITE){
        div.classList.add("pawn-white");
    }
    

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

    tiles[col-1][row-1].appendChild(div);

}

function drawPawns(stack) {
    for (let i=0; i<stack.length; i++) {
        drawPawn(stack[i]);
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
        usPawns.push(new Pawn(Color.WHITE,Side.US));
        themPawns.push(new Pawn(Color.BLACK,Side.THEM));
    }

    drawPawns(usPawns);
    drawPawns(themPawns);

    for (let i=0; i<15; i++) {
        themPawns[1].move(1);
        await sleep(500);
        usPawns[2].move(1);
        await sleep(500);

    }
}

init();