const GameDiv = document.getElementById("game");
const BoardDiv = document.getElementById("board");
const DicesDiv = document.getElementById("dices");
const SettingsIcon = document.getElementById("icon-settings");
const SettingsMenu = document.getElementById("menu-settings");

let pawnStackStyle = document.createElement('style');
let updateConfigCallbacks = [];

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
    for (let i = 0; i < Config.nPawns.val; i++) {
        Pawns[0].push(new Pawn(Color.WHITE, Side.LEFT, i));
        Pawns[0][i].draw();
        Pawns[1].push(new Pawn(Color.BLACK, Side.RIGHT, i));
        Pawns[1][i].draw();
    }
}

function stylePawnStack() {
    pawnStackStyle.type = 'text/css';
    pawnStackStyle.innerHTML = '';
    let distance = 4;
    for (let i = 1; i < Config.nPawns.val; i++) {
        pawnStackStyle.innerHTML +=
            `
        .tile .pawn:nth-child(${i + 1}) {
            position: absolute;
            bottom: ${distance * i}px;
        }
        `;
    }
    document.getElementsByTagName('head')[0].appendChild(pawnStackStyle);
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
    let urls = [
        "border_clay_tablet.png"
    ];
    for (url in urls) {
        let img = new Image();
        img.src = `./resources/${url}`;
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
    elm.innerHTML =
    `wersja ${version.number} - ${version.name}<br>
    wydana w dniu ${version.date}`;
}

SettingsIcon.onclick = (evt) => {
    SettingsIcon.classList.toggle("opened");
    SettingsMenu.classList.toggle("opened");
    window.onclick = window.onclick ? null : (evt) => {
        if (!(evt.target == SettingsMenu || SettingsMenu.contains(evt.target)) && evt.target != SettingsIcon) {
            SettingsIcon.classList.remove("opened");
            SettingsMenu.classList.remove("opened");
            window.onclick = null;
        }

    }
};


function switchFlick (opt, elm) {
    console.log(Config[opt].val)
    if (Config[opt].val == false) {
        console.log("turning on")
        setConfig(opt, true);
        callIfExists(Config[opt].control.callbackOn);
        elm.classList.add("on");
        elm.classList.remove("off");
    } else {
        console.log("turning off")
        setConfig(opt, false);
        callIfExists(Config[opt].control.callbackOff);
        elm.classList.add("off");
        elm.classList.remove("on");
    }
}

function lockOption (opt, val, elm) {
    localStorage.setItem(opt, val);
}

async function populateSettings () {
    for (let opt in Config) {
        let elm = document.createElement("div");
        let label = document.createElement("label");
        elm.appendChild(label);
        label.innerText = Config[opt].control.label;
        let type = Config[opt].control.type;
        elm.classList.add("settings-item", type)
        switch (type) {
            case "bool":
                elm.classList.add(Config[opt].val ? "on" : "off");
                let on = document.createElement("span");
                let off = document.createElement("span");
                on.className = "on";
                on.innerText = "on";
                off.className = "off";
                off.innerText = "off";
                elm.prepend(on)
                elm.append(off)
                elm.onclick = () => switchFlick(opt, elm);
                updateConfigCallbacks.push(() => {
                    let state = Config[opt].val ? "on" : "off";
                    if (!elm.classList.contains(state)) {
                        console.log(state, elm.classList.contains(state));
                        elm.classList.remove(state == "on" ? "off" : "on");
                        elm.classList.add(state);
                    }
                });
                break;

            case "slider":
                let slider = document.createElement("input");
                slider.type = "range";
                slider.min = Config[opt].control.min;
                slider.max = Config[opt].control.max;
                slider.value = Config[opt].val;
                let numberField = document.createElement("input");
                numberField.min = 1;
                numberField.value = Config[opt].val;

                slider.oninput = () => {
                    let v = slider.value;
                    if (GameHasStarted) {
                        lockOption(opt, v, elm)
                    } else {
                        setConfig(opt, v);
                        callIfExists(Config[opt].control.callback);
                    }
                    numberField.value = v;
                }
                numberField.oninput = () => {
                    let v = numberField.value;
                    if (v < 1) {
                        v = 1;
                        numberField.value = v;
                    }
                    if (GameHasStarted) {
                        lockOption(opt, v, elm)
                    } else {
                        setConfig(opt, v);
                        callIfExists(Config[opt].control.callback);
                    }
                    slider.value = v;
                }
                
                label.appendChild(numberField)
                elm.appendChild(slider);
                
                updateConfigCallbacks.push(() => {
                    let realVal = Config[opt].val;
                    slider.value = realVal;
                    numberField.value = realVal;
                    callIfExists(Config[opt].control.callback);
                });

                break;
        
            default:
                console.log("Błąd::Zły typ kontrolki konfiguracji");
                break;
        }
        SettingsMenu.append(elm);
    }
    let resetBtn = document.createElement("button");
    resetBtn.innerHTML = "Przywróć ustawienia</br>domyślne";
    resetBtn.onclick = () => resetDefaults();
    resetBtn.classList.add("settings-item", "button");
    SettingsMenu.append(resetBtn);
}

function updateSettings () {
    for (let callback of updateConfigCallbacks) {
        callback();
    }
}