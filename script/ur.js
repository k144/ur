let boardDiv = document.getElementById("board");

let tileTypeMap = new Map([
    ['*', "rosette"],
    ['H', "gate"],
    ['O', "temple"],
    ['.', "house"],
    ['+', "market"],
    ['X', "treasury"]

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
    }
    move(n){
        this.pos+=n;
        //sprawdz czy miejsce jest wolne
        
    }
}

let tiles = new Array(board.length);
for (let i = 0; i < tiles.length; i++) {
    tiles[i] = new Array(3)
}

function makeTile (x, y, type)
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
            if (tile == ' ') 
            {
                return;
            }
            let type = tileTypeMap.get(tile);

            // iteratory w foreach() zaczynają się od 0, a elementy w gridzie od 1
            // dlatego trzeba dodać 1 //zerzniete z magicznych bloczkow
            makeTile(j+1, i+1, type);
        })
    })


}

function drawPawn(pawn) {
    let side = pawn.side;
    let pos = pawn.pos;
    let color = pawn.color;

    let pawnDiv = document.createElement("div");
    pawnDiv.classList.add("pawn");
    if(color==Color.BLACK){
        pawnDiv.classList.add("pawn-black");
    }
    if(color==Color.WHITE){
        pawnDiv.classList.add("pawn-white");
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

    tiles[col-1][row-1].append(pawnDiv);

}

//function dices(){
    //kostki, losowanie
//}

function init(){
    let usPawns=new Array();
    let themPawns=new Array();
    let white=new Pawn(Color.WHITE,Side.US);
    let black=new Pawn(Color.BLACK,Side.THEM);
    black.move(1);
    white.move(1);

    drawBoard();
    drawPawn(white);
    drawPawn(black);

    for(let i=0;i<7;i++){
        usPawns.push(new Pawn(Color.WHITE,Side.US));
        themPawns.push(new Pawn(Color.BLACK,Side.THEM));
    }
}

init();