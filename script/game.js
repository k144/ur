const MaxPos = 15;


function locateTile(pos, side) {
    let row, col;

    const turn1 = 4;
    const turn2 = 12;
    const width = 8;

    if (side == Side.LEFT) {
        col = 1;
    } else if (side == Side.RIGHT) {
        col = 3;
    }

    if (pos <= turn1) {
        row = 5 - pos;
    } else if (pos <= turn2) {
        row = pos - turn1;
        col = 2;
    } else if (pos <= MaxPos) {
        row = turn2 + 1 - pos + width;
    }
    return tiles[col - 1][row - 1];

}


function getPawn(div) {
    if (!div || !div.className || !div.className.includes("pawn")) {
        return undefined;
    }
    return Pawns[div.dataset.side][div.dataset.nth];
}

class Pawn {
    constructor(color, side, nth) {
        this.color = color;
        this.side = side;
        this.pos = 0;
        this.div = document.createElement("div");
        this.div.dataset.nth = nth;
        this.div.dataset.side = side;
    }
    makeGrabable() {
        if (isTouchDevice) {
            this.div.ontouchstart = (evt) => this.stickTouch(evt);
            this.div.ontouchend = () => {
                document.ontouchmove = null;
                this.unstick();
            }
        } else {
            this.div.onmousedown = (evt) => this.stickMouse(evt);
            this.div.onmouseup = () => {
                document.onmousemove = null;
                this.unstick();
            }
        }

    }
    stickMouse(passevt) {
        this.showLegalMove();
        this.div.classList.add("sticked");
        let style = this.div.style;
        let [offX, offY] = [passevt.layerX, passevt.layerY];
        document.onmousemove = (evt) => {
            style.position = "fixed";
            style.left = `${evt.clientX - offX}px`;
            style.top = `${evt.clientY - offY}px`;
        }

    }
    stickTouch(passevt) {
        this.showLegalMove();
        this.div.classList.add("sticked");
        let style = this.div.style;
        let rect = passevt.target.getBoundingClientRect()
        let firstTouch = passevt.targetTouches[0];
        let offX = firstTouch.pageX - rect.left;
        let offY = firstTouch.pageY - rect.top;
        // let [offX, offY] = [passevt.layerX, passevt.layerY];
        document.ontouchmove = (evt) => {
            style.position = "fixed";
            let touch = evt.targetTouches[0];
            style.left = `${touch.screenX - offX}px`;
            style.top = `${touch.screenY - offY}px`;
        }

    }
    unstick() {
        this.clearSel();
        let style = this.div.style;
        style.position = "";
        style.left = "";
        style.top = "inherit";
        this.div.classList.remove("sticked");

    }
    move() {
        if (!this.canMove()) { return };
        this.clearSel();
        let otherPawnsDiv = locateTile(this.pos + TilesToMove, this.side).firstChild;
        if (otherPawnsDiv != null && this.pos + TilesToMove != MaxPos) {
            let otherPawn = getPawn(otherPawnsDiv);
            otherPawn.moveBack();
        }
        this.moveTo(TilesToMove);

    }
    moveTo(n) {
        this.pos += n;
        this.draw();
    }
    moveBack() {
        this.moveTo(-(this.pos));
    }
    canMove() {
        const dest = TilesToMove + this.pos;
        if (dest > MaxPos) {
            return false;
        }
        if (dest == MaxPos) {
            return true;
        }
        let tile = locateTile(this.pos + TilesToMove, this.side);
        let child = tile ? getPawn(tile.firstChild) : null;
        if (child == undefined) {
            return true;
        } else if (child.color == this.color || tile.dataset.extraRoll == "true") {
            return false;
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

        let tile = locateTile(this.pos, this.side);
        tile.appendChild(this.div);
    }
    showLegalMove() {
        if (!this.canMove()) {
            return;
        }
        locateTile(this.pos + TilesToMove, this.side).classList.add("tile-selected");
    }
    clearSel() {
        locateTile(this.pos + TilesToMove, this.side).classList.remove("tile-selected");
    }
    set isHighlighted(val) {
        if (val) {
            this.div.classList.add("highlighted");
        } else {
            this.div.classList.remove("highlighted");
        }

    }
}



class Dice {
    constructor() {
        this.orientation = 0;
        this.drawn = false;
        this.div = document.createElement("div");
        this.div.className = "dice";
        document.getElementById("dices").appendChild(this.div);
        this.updateImage();
    }
    async roll() {
        let o = rand(0, 6);
        if (o == this.orientation) {
            this.roll();
            return;
        }
        this.orientation = o;
        this.div.style.transform = `rotate(${rand(0, 360)}deg)`;
        this.drawn = this.orientation < 3;
        this.updateImage();
    }
    updateImage() {
        let style = `url('./resources/dice_${+this.drawn}_${this.orientation % 3}.png')`;
        this.div.style.backgroundImage = style;
    }

}



/*
async function getClicked() {

}
*/

async function getElm(event = "click") {
    return new Promise((resolve) => {
        document.addEventListener(event, (evt) => {
            let x = evt.clientX;
            let y = evt.clientY;
            let elm = document.elementFromPoint(x, y);
            resolve(elm);
        }, { once: true })
    })
}

async function roll() {
    TilesToMove = 0;

    if (Config.autoRoll == false) {
        DicesDiv.classList.add("highlighted");
        while (true) {
            let elm = await getElm();
            if (elm.className === "dice") {
                break;
            }
        }
        DicesDiv.classList.remove("highlighted");
    }

    await Promise.all(Dices.map(async function (dice) {
        const speed = Math.random() * 1.6 + 1.45;
        for (let t = 100; t < 500; t = t * speed + 1) {
            dice.roll();
            await sleep(t);
        }
        TilesToMove += dice.drawn;
        return;
    }));
    // for (let dice of Dices) {
    //     await dice.roll();
    //     TilesToMove += dice.drawn;
    // }
    // if (TilesToMove <= 0) {
    //     displayInfo("wylosowano 0, spróbuj szczęścia następnym razem");
    // }
}

function clearPawns(side) {

    let funcs = [
        "mouseover",
        "mouseleave",
        "mousedown",
        "mouseup",
        "tochmove",
        "touchend",
    ];

    for (let pawn of Pawns[side]) {
        pawn.isHighlighted = false;

        for (let func of funcs) {
            pawn.div["on" + func] = null;

        }

    }

}

let MoveFlag = false;

document.addEventListener("mousemove", () => MoveFlag = true);
document.addEventListener("touchmove", () => MoveFlag = true);

async function getSelectedPawn(side) {
    let pawn;
    while (true) {

        let downElm = await getElm("mousedown");
        MoveFlag = false;
        pawn = getPawn(downElm);
        if (!pawn || !(pawn.side == side) || !pawn.canMove()) {
            continue;
        }

        let upElm = await getElm("mouseup")
            if (   MoveFlag == false
                || upElm == locateTile(pawn.pos + TilesToMove, pawn.side)
                || upElm.classList.contains("pawn") && (
                       upElm.dataset.side != pawn.side
                    || Pawns[upElm.dataset.side][upElm.dataset.nth].pos == MaxPos
                )
            ) {
                return pawn;
            }

    }
}



let side = Side.LEFT;
async function* turn() {
    if (side == Side.LEFT) {
        side = Side.RIGHT;
    } else {
        side = Side.LEFT;
    }

    let extraRoll = false;
    do {
        await roll();
        if (TilesToMove <= 0) { return };

        let nMovable = 0;
        for (let p of Pawns[side]) {
            if (!p.canMove()) {
                continue;
            }
            nMovable++;
            p.isHighlighted = true;
            p.div.onmouseover = () => p.showLegalMove();
            p.div.onmouseleave = () => p.clearSel();
            p.makeGrabable();
        }

        if (nMovable <= 0) {
            // displayInfo("brak możliwych ruchów");
            return
        }

        let pawn = await getSelectedPawn(side);
        pawn.move();
        clearPawns(side);

        let nFinished = locateTile(MaxPos, pawn.side).childElementCount
        if (nFinished >= NPawns) {
            displayInfo("wygrywa: ", side == Side.LEFT ? "lewa strona" : "prawa strona")
            return "end";
        }
        extraRoll = locateTile(pawn.pos, side).dataset.extraRoll;

    } while (extraRoll == "true");
    return;
}