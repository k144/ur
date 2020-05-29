let boardDiv = document.getElementById("board");


let boardLeftBeg = [
    [1, 1, "rosette"],
    [1, 2],
    [1, 3],
    [1, 4],
]

let boardRightBeg = [
    [3, 1, "rosette"],
    [3, 2],
    [3, 3],
    [3, 4],
]

let boardCenter = [
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4, "rosette"],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
]

let boardLeftEnd = [
    [1, 8],
    [1, 7, "rosette"],
]

let boardRightEnd = [
    [3, 8],
    [3, 7, "rosette"],
]



board = [
    boardLeftBeg, boardRightBeg,
    boardCenter,
    boardLeftEnd, boardRightEnd
];


function putTile (x, y, type)
{
    let t = document.createElement("div");

    t.className = "tile";
    if (type != undefined) {
        t.className += ` tile-${type}`;
    }

    t.style.gridColumn = x + "/ span 1";
    t.style.gridRow = y + "/ span 1";

    boardDiv.append(t);
}

function drawBoard ()
{
    board.forEach((elem) =>
    {
        elem.forEach((arr) =>
        {
            [x, y, type] = arr;
            putTile (x, y, type);
        })
    })
}

drawBoard();