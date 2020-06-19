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
    move(n) {
        this.pos += n;
        this.draw();
        //sprawdz czy miejsce jest wolne
    }
    moveBack() {
        this.move(-(this.pos));
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
        } else if (child.color == this.color) {
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
    showLegalMove(offset) {
        if (!this.canMove()) {
            return;
        }
        locateTile(this.pos + offset, this.side).classList.add("tile-selected");
    }
    clearSel(offset) {
        locateTile(this.pos + offset, this.side).classList.remove("tile-selected");
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
    roll() {
        this.orientation = Math.floor(Math.random() * (5 + 1));
        this.drawn = this.orientation < 3;
        this.updateImage();
    }
    updateImage() {
        let style = `url('./resources/dice_${+this.drawn}_${this.orientation % 3}.png')`;
        this.div.style.backgroundImage = style;
    }

}


function pawnClick(pawn) {
    pawn.clearSel(TilesToMove);
    let otherPawnsDiv = locateTile(pawn.pos + TilesToMove, pawn.side).firstChild;
    if (otherPawnsDiv != null && pawn.pos + TilesToMove != MaxPos) {
        var otherPawn = getPawn(otherPawnsDiv);
        otherPawn.moveBack();
    }
    pawn.move(TilesToMove);
}

function pawnMouseover(evt) {
    let pawn = getPawn(evt.currentTarget);
    pawn.showLegalMove(TilesToMove);
}

function pawnMouseLeave(evt) {
    let pawn = getPawn(evt.currentTarget);
    pawn.clearSel(TilesToMove);
}

function clearPawns(side) {
    for (pawn of Pawns[side]) {
        pawn.isHighlighted = false;
        pawn.div.onmouseover = null;
        pawn.div.onmouseleave = null;
    }
}

/*
async function getClicked() {

}
*/

async function getElm() {
    return new Promise((resolve) => {
        document.addEventListener("click", (evt) => {
            let x = evt.clientX;
            let y = evt.clientY;
            let elm = document.elementFromPoint(x, y);
            resolve(elm);
        }, { once: true })
    })
}

async function roll() {
    TilesToMove = 0;

    DicesDiv.classList.add("highlighted");
    while (true) {
        let elm = await getElm();
        if (elm.className === "dice") {
            break;
        }
    }

    for (let dice of Dices) {
        dice.roll();
        TilesToMove += dice.drawn;
    }
    DicesDiv.classList.remove("highlighted");
}

async function getSelectedPawn(side) {
    let pawn = getPawn(await getElm());
    if (!pawn || !pawn.canMove || pawn.side != side) {
        return undefined;
    }
    return pawn;
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
        if (TilesToMove == 0) {
            return;
        }
        let nMovable = 0;
        for (p of Pawns[side]) {
            if (!p.canMove()) {
                continue;
            }
            nMovable++;
            p.isHighlighted = true;
            p.div.onmouseover = pawnMouseover;
            p.div.onmouseleave = pawnMouseLeave;
        }

        if (nMovable <= 0) {
            return
        }

        let pawn;
        while (pawn == undefined) {
            pawn = await getSelectedPawn(side);
        }
        pawnClick(pawn);
        clearPawns(side);

        let nFinished = locateTile(MaxPos, pawn.side).childElementCount
        if (nFinished >= NPawns) {
            console.log("wygrywa: ", side == Side.LEFT ? "lewa strona" : "prawa strona")
            return "end";
        }
        extraRoll = locateTile(pawn.pos, side).dataset.extraRoll;
        console.log(side, extraRoll);

    } while (extraRoll == "true");
    return;
}