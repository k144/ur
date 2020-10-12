const GameDiv = document.getElementById("game");
const BoardDiv = document.getElementById("board");
const DicesDiv = document.getElementById("dices");
const SettingsIcon = document.getElementById("icon-settings");
const SettingsMenu = document.getElementById("menu-settings");

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
        .tile .pawn:nth-child(${i + 1}) {
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

async function preloadImgs() {
    // Kości
    for (let i = 0; i < 3; i++) {
        let [img0, img1] = [new Image(), new Image()];
        img0.src = `./resources/dice_0_${i}.png`;
        img1.src = `./resources/dice_1_${i}.png`;
    }
}

async function displayInfo(message, time=2) {
    const transition = 200;
    const duration = time * 1000;

    let infoElm = document.createElement("div");
    document.getElementById("infoPanel").append(infoElm);
    let span = document.createElement("span");
    infoElm.append(span);
    infoElm.className = "info";
    infoElm.style.transition = `all ${transition}ms`;
    infoElm.onclick = remove;

    async function remove() {
        infoElm.style.opacity = 0;
        infoElm.style.display = "inline-block";
        await sleep(transition);
        infoElm.parentNode.removeChild(infoElm);
    }


    span.innerHTML = message;
    infoElm.style.display = "inline-block";
    infoElm.style.opacity = 0;
    await sleep(transition);
    infoElm.style.opacity = 1;
    await sleep(duration);
    remove();
    return;
}

function drawVersion() {
    let elm = document.getElementById("version");
    let v = Config.version;
    elm.innerHTML =
    `wersja ${v.number} - ${v.name}<br>
    wydana w dniu ${v.date}`;
}

SettingsIcon.onclick = (evt) => {
    SettingsIcon.classList.toggle("opened");
    SettingsMenu.classList.toggle("opened");
    window.onclick = window.onclick ? null : (evt) => {
        if (evt.target != SettingsMenu && evt.target != SettingsIcon) {
            SettingsIcon.classList.remove("opened");
            SettingsMenu.classList.remove("opened");
            window.onclick = null;
        }

    }
};