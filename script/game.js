const MaxPos = 15;

function locateTile(pawn, offset = 0) {
    let side = pawn.side;
    let pos = pawn.pos + offset;

    let row, col;

    if (side == Side.US) {
        col = 1;
    } else if (side == Side.THEM) {
        col = 3;
    }

    if (pos <= 4) {
        row = 5 - pos;
    } else if (pos <= 12) {
        row = pos - 4;
        col = 2;
    } else if (pos <= MaxPos) {
        row = 13 - pos + 8;
    }
    return tiles[col - 1][row - 1];

}


function getPawn(div) {
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
        this.div.addEventListener("click", () => {
            this.clearSel(TilesToMove);
            if ((this.pos + TilesToMove) > MaxPos) {
                return;
            }
            let otherPawnsDiv = locateTile(this, TilesToMove).firstChild;
            if (otherPawnsDiv != null) {
                var otherPawn = getPawn(otherPawnsDiv);
                if (otherPawn.side == this.side &&
                    (this.pos + TilesToMove) < MaxPos
                ) {
                    return;
                } else if (otherPawn.side != this.side) {
                    otherPawn.moveBack();
                }
            }
            this.move(TilesToMove);
        }
        );
        this.div.addEventListener("mouseover", () => {
            this.showLegalMoves(TilesToMove);
        }
        );
        this.div.addEventListener("mouseleave", () => {
            this.clearSel(TilesToMove);
        }
        );

    }
    move(n) {
        this.pos += n;
        this.draw();
        //sprawdz czy miejsce jest wolne
    }
    moveBack() {
        this.move(-(this.pos));
    }
    canMove(offset) {
        let tile = locateTile(this, offset);
        let child = tile.firstChild;
        if (child == undefined) {
            return true;
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
    showLegalMoves(offset) {
        if (!this.canMove(TilesToMove)) {
            return;
        }
        locateTile(this, offset).classList.add("tile-selected");
    }
    clearSel(offset) {
        locateTile(this, offset).classList.remove("tile-selected");
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