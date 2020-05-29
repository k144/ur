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
            // dlatego trzeba dodać 1
            putTile(j+1, i+1, type);
        })
    })
}

drawBoard();