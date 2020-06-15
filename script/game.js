const MaxPos = 15;

function locateTile(pawn, offset = 0) {
    let side = pawn.side;
    let pos = pawn.pos + offset;

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
    if (!div || !div.className ||!div.className.includes("pawn")) {
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
        let tile = locateTile(this, TilesToMove);
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

        let tile = locateTile(this);
        tile.appendChild(this.div);
    }
    showLegalMove(offset) {
        if (!this.canMove()) {
            return;
        }
        locateTile(this, offset).classList.add("tile-selected");
    }
    clearSel(offset) {
        locateTile(this, offset).classList.remove("tile-selected");
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

function roll() {
    TilesToMove = 0;
    for (let dice of Dices) {
        dice.roll();
        TilesToMove += dice.drawn;
    }
}


function pawnClick(pawn) {
    pawn.clearSel(TilesToMove);
    let otherPawnsDiv = locateTile(pawn, TilesToMove).firstChild;
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

async function getSelectedPawn(side) {
    return new Promise((resolve) => {
        document.addEventListener("click", (evt) => {
            let x = evt.clientX;
            let y = evt.clientY;
            let pawn = getPawn(document.elementFromPoint(x,y))
            if (!pawn || !pawn.canMove || pawn.side != side) {
                resolve(undefined);
            }
            resolve(pawn);
        }, {once: true})
    })
}

async function turn(side) {
    roll();

    //freezuje sie jak nie ma wyboru, na dole w petli zobaczyć czy chociaż 1 raz canMove() == true

    for (p of Pawns[side]) {
        if (!p.canMove()) {
            continue;
        }
        p.isHighlighted = true;
        p.div.onmouseover = pawnMouseover;
        p.div.onmouseleave = pawnMouseLeave;
    }

    let pawn;
    while (pawn == undefined) {
        pawn = await getSelectedPawn(side);
    }

    pawnClick(pawn);
    clearPawns(side);
    return;
}