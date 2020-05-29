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

let Kolor = {CZARNY:1, BIALY:2};
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

let white=new Pawn(Kolor.BIALY,Side.US);
white.move(5);
white.move(1);
console.log(white);

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
            putTile(j+1, i+1, type);
        })
    })
}


drawBoard();